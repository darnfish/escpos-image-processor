const fs = require("fs");

const Jimp = require("jimp");
const replaceColor = require("replace-color");

const cannyEdgeDetector = require("canny-edge-detector");
const { Image } = require("image-js");

module.exports = {
    /**
     * Converts an image (path) to a escpos-printable image and saves it to a location (out).
     * 
     * @param {String} path
     * @param {String} out
     * @param {Function} callback
     */
    convert: (path, out, callback) => {
        Image.load(path).then(img => {
            const edge = cannyEdgeDetector(img.grey(), {
                lowThreshold: 30,
                highThreshold: 30,
                gaussianBlur: 3
            });
        
            edge.save("./edges.png").then(() => {
                replaceColor({
                    image: "./edges.png",
                    colors: {
                        type: "hex",
                        targetColor: "#000000",
                        replaceColor: "#00000000"
                    }
                }, (err, eImg) => {
                    fs.unlink("./edges.png");
                    if(!err) {
                        let ratio = {
                            w: eImg.getWidth(),
                            h: eImg.getHeight()
                        };
                    
                        let w = 185;
                        let h = w * (ratio.h / ratio.w);
        
                        eImg.invert().resize(w, h).write(out, () => {
                            callback(path)
                        });
                    } else {
                        callback(false);
                    }
                })
            }).catch(err => {
                console.log(err)
                callback(false);
            });
        })
    }
}