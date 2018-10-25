# escpos-image-processor
A Node.JS program that turns an image from a path into an escpos-printable image.

## Installation

`escpos-image-processor` is available through NPM:

```npm install escpos-image-processor --save```

## Usage

```javascript
// Import the package
const escposImageProcessor = require("escpos-image-processor");

// Put the path to your image in the first parameter (.in.png) and put the location where the image should be saved in the second parameter (./processed.png).
escposImageProcessor.convert("./in.png", "./processed.png", path => {
    // The callback will return the path if all went well, if there was an error it will return 'false'.
    if(path) {
        console.log(`Processed image saved to ${path}`);
    } else {
        console.log("An Error Occurred");
    }
})
```
## Usage with `escpos`

If you wish to use `escpos-image-processor` with the `escpos` module, look at the example below:

```javascript
const escpos = require("escpos");
const device  = new escpos.USB();
const printer = new escpos.Printer(device);

const escposImageProcessor = require("escpos-image-processor");

escposImageProcessor.convert("./in.png", "./processed.png", path => {
    if(path) {
        console.log(`Processed image saved to ${path}`);

        escpos.Image.load(path, image => {
            device.open(() => {
                printer.align("lt").raster(image, "dwdh").cut().close();
            });
        });
    } else {
        console.log("An Error Occurred");
    }
})
```