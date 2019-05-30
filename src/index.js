import fs from 'fs'
import Jimp from 'jimp'
import { Image } from 'image-js'
import replaceColor from 'replace-color'
import cannyEdgeDetector from 'canny-edge-detector'

class ESCPOSImageProcessor {
    /**
     * 
     * @param {Object} options 
     */
    constructor(options) {
        if(typeof options !== 'undefined') {
            this.options = options
        } else {
            this.options = {
                quality: 'best'
            }
        }

        this.hasConverted = false
        this.hasResized = false
        this.path = ''
        this.processID = this.genProcessID()
    }

    /**
     * 
     * @param {*} device escpos module device
     * @param {*} printer escpos module printer
     */
    print(device, printer) {
        if(!this.hasConverted) { return }

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
    convert(path, out) {
        return new Promise((resolve, reject) => {
            this.path = out
            this.hasResized = false

            Jimp.read(path).then(original => {
                if(this.options.quality == 'good') {
                    let ratio = this.getRatio(original)

                    original.resize(ratio.w, ratio.h)
                    this.hasResized = true
                }

                const orgPath = `./${this.processID}-org.png`
                original.write(orgPath, () => {
                    Image.load(orgPath).then(image => {
                        fs.unlinkSync(orgPath)
                        const threshold = 30
            
                        const edge = cannyEdgeDetector(image.grey(), {
                            lowThreshold: threshold,
                            highThreshold: threshold,
                            gaussianBlur: threshold / 10
                        })
                    
                        const edgePath = `./${this.processID}-edges.png`
                        edge.save(edgePath).then(() => {
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
                                    let ratio = this.getRatio(edges)

                                    edges.resize(ratio.w, ratio.h)
                                    this.hasResized = true
                                }

                                edges.write(out, () => {
                                    this.hasConverted = true

                                    resolve(out)
                                })
                            })
                        }).catch(error => reject(error))
                    })
                })
            }).catch(error => reject(error))
        })
    }

    genProcessID() {
        let t = ''
        const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        
        for(let i=0; i < 5; i++){
            t += p.charAt(Math.floor(Math.random() * p.length))
        }
        
        return t
    }

    getRatio(img) {
        const ratio = {
            w: img.getWidth(),
            h: img.getHeight()
        }
    
        const w = this.options.width || 185
        const h = w * (ratio.h / ratio.w)

        return {
            w: w,
            h: h
        }
    }
}

module.exports = ESCPOSImageProcessor