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
        this.path = "";
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
     * @param {Function} callback The callback for the image, with a `path` parameter.
     */
    convert(path, out, callback) {
        this.path = out;

        Image.load(path).then(img => {
            const threshold = 30;

            const edge = cannyEdgeDetector(img.grey(), {
                lowThreshold: threshold,
                highThreshold: threshold,
                gaussianBlur: threshold / 10
            });
        
            edge.save("./edges.png").then(() => {
                replaceColor({
                    image: "./edges.png",
                    colors: {
                        type: "hex",
                        targetColor: "#000000",
                        replaceColor: "#00000000"
                    }
                }, (err1, eImg) => {
                    fs.unlink("./edges.png");
                    if(!err1) {
                        let ratio = {
                            w: eImg.getWidth(),
                            h: eImg.getHeight()
                        };
                    
                        let w = this.options.width || 185;
                        let h = w * (ratio.h / ratio.w);
        
                        eImg.invert().resize(w, h).write(out, () => {
                            this.hasConverted = true;
                            callback(path);
                        });
                    } else {
                        callback(false);
                    }
                })
            }).catch(err0 => {
                callback(false);
            });
        })
    }
}

module.exports = ESCPOSImageProcessor