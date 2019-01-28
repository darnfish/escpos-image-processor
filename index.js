const fs = require("fs");

const Jimp = require("jimp");
const replaceColor = require("replace-color");

const cannyEdgeDetector = require("canny-edge-detector");
const { Image } = require("image-js");

class ESCPOSImageProcessor {
    /**
     * 
     * @param {Object} options 
     */
    constructor(options) {
        if(typeof options !== "undefined") {
            this.options = options
        } else {
            this.options = {
                quality: "best"
            };
        }

        this.hasConverted = false;
        this.hasResized = false;
        this.path = "";
        this.processID = this.genProcessID();
    }

    /**
     * 
     * @param {*} device escpos module device
     * @param {*} printer escpos module printer
     */
    print(device, printer) {
        if(this.hasConverted) {
            escpos.Image.load(this.path, image => {
                device.open(() => {
                    printer.align("lt").raster(image, "dwdh").cut().close();
                });
            });
        }
    }

    /**
     * 
     * @param {String} path The input path for the image.
     * @param {String} out The output path for the processed image.
     */
    convert(path, out) {
        return new Promise((resolve, reject) => {
            this.path = out;
            this.hasResized = false;

            Jimp.read(path).then(oImg => {
                if(this.options.quality == "good") {
                    let ratio = this.getRatio(oImg);

                    oImg.resize(ratio.w, ratio.h);
                    this.hasResized = true;
                }

                const orgPath = `./${this.processID}-org.png`;
                oImg.write(orgPath, () => {
                    Image.load(orgPath).then(img => {
                        fs.unlinkSync(orgPath);
                        const threshold = 30;
            
                        const edge = cannyEdgeDetector(img.grey(), {
                            lowThreshold: threshold,
                            highThreshold: threshold,
                            gaussianBlur: threshold / 10
                        });
                    
                        const edgePath = `./${this.processID}-edges.png`;
                        edge.save(edgePath).then(() => {
                            replaceColor({
                                image: edgePath,
                                colors: {
                                    type: "hex",
                                    targetColor: "#000000",
                                    replaceColor: "#00000000"
                                }
                            }, (err2, eImg) => {
                                fs.unlinkSync(edgePath);
                                if(!err2) {
                                    eImg.invert();

                                    if(this.options.quality == "best" || !this.hasResized) {
                                        let ratio = this.getRatio(eImg);

                                        eImg.resize(ratio.w, ratio.h)
                                        this.hasResized = true;
                                    }

                                    eImg.write(out, () => {
                                        this.hasConverted = true;

                                        resolve(out);
                                    });
                                } else {
                                    reject(err2);
                                }
                            })
                        }).catch(err1 => {
                            reject(err1);
                        });
                    })
                });
            }).catch(err0 => {
                reject(err0);
            });
        })
    }

    genProcessID() {
        let t = "";
        let p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for(var i=0; i<5; i++){
            t += p.charAt(Math.floor(Math.random() * p.length));
        }
        
        return t;
    }

    getRatio(img) {
        let ratio = {
            w: img.getWidth(),
            h: img.getHeight()
        };
    
        let w = this.options.width || 185;
        let h = w * (ratio.h / ratio.w);

        return {
            w: w,
            h: h
        }
    }
}

module.exports = ESCPOSImageProcessor