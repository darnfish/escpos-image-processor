import fs from 'fs'
import Jimp from 'jimp'
import escpos from 'escpos'
import { Image } from 'image-js'
import replaceColor from 'replace-color'
import cannyEdgeDetector from 'canny-edge-detector'

type IProcessorQuality = 'best' | 'good'

export interface IProcessorOptions {
    width?: number
    quality: IProcessorQuality
}

export default class ESCPOSImageProcessor {
    options: IProcessorOptions

    hasResized: boolean = false
    hasConverted: boolean = false

    path: string = ''
    processId: string

    constructor(options: IProcessorOptions) {
        if(options)
            this.options = options
        else
            this.options = {
                quality: 'best'
            }

        this.processId = this.genProcessId()
    }

    /**
     * 
     * @param {*} device escpos module device
     * @param {*} printer escpos module printer
     */
    print = (device, printer) => {
        if(!this.hasConverted) return

        escpos.Image.load(this.path, image => {
            device.open(() => {
                printer.align('lt').raster(image, 'dwdh').cut().close()
            })
        })
    }

    /**
     * 
     * @param {String} path The input path for the image.
     * @param {String} out The output path for the processed image.
     */
    convert = (path: string, out: string) => new Promise<string>(async (resolve, reject) => {
        this.path = out
        this.hasResized = false

        const original = await Jimp.read(path) 

        if(this.options.quality == 'good') {
            let { w, h } = this.getRatio(original)

            original.resize(w, h)
            this.hasResized = true
        }

        const orgPath = `./${this.processId}-org.png`
        original.write(orgPath, async () => {
            const image = await Image.load(orgPath)

            fs.unlinkSync(orgPath)

            const threshold = 30
    
            const edge = cannyEdgeDetector(image.grey(), {
                lowThreshold: threshold,
                highThreshold: threshold,
                gaussianBlur: threshold / 10
            })
        
            const edgePath = `./${this.processId}-edges.png`
            await edge.save(edgePath)

            replaceColor({
                image: edgePath,
                colors: {
                    type: 'hex',
                    targetColor: '#000000',
                    replaceColor: '#00000000'
                }
            }, (error, edges) => {
                fs.unlinkSync(edgePath)

                if(error) { return reject(error) }

                edges.invert()

                if(this.options.quality == 'best' || !this.hasResized) {
                    let { w, h } = this.getRatio(edges)

                    edges.resize(w, h)
                    this.hasResized = true
                }

                edges.write(out, () => {
                    this.hasConverted = true

                    resolve(out)
                })
            })
        })
    })

    private genProcessId() {
        let t = ''
        const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        
        for(let i = 0; i < 5; i++)
            t += p.charAt(Math.floor(Math.random() * p.length))
        
        return t
    }

    getRatio(img: Jimp) {
        const ratio = {
            w: img.getWidth(),
            h: img.getHeight()
        }
    
        const w = this.options.width || 185
        const h = w * (ratio.h / ratio.w)

        return { w, h }
    }
}