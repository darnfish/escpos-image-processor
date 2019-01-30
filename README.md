# escpos-image-processor
A Node.JS program that turns an image from a path into an escpos-printable image.

## Installation

`escpos-image-processor` is available through NPM:

```npm install escpos-image-processor --save```
```yarn add escpos-image-processor```

## Usage

```javascript
// Import the package
const ESCPOSImageProcessor = require("escpos-image-processor");

// Create an instance of the class
const processor = new ESCPOSImageProcessor({
    width: 185, /* optional, defaults to 185 (default 40mm printer roll width in px) */
    quality: "best" /* optional, defaults to "best" (slowest). another option is "good", which is faster but produces worse results */
});

// Put the path to your image in the first parameter (".in.png") and put the location where the image should be saved in the second parameter ("./processed.png").
processor.convert("./in.png", "./processed.png").then(path => {
    // The callback will return the path if all went well, if there was an error it will return 'false'.
    if(path) {
        console.log(`Processed image saved to ${path}`);
    } else {
        console.log("An Error Occurred");
    }
}).catch(error => console.error(error));
```
## Usage with `escpos`

If you wish to use `escpos-image-processor` with the `escpos` module, look at the example below:

```javascript
const escpos = require("escpos");
const device  = new escpos.USB();
const printer = new escpos.Printer(device);

const ESCPOSImageProcessor = require("escpos-image-processor");

const processor = new ESCPOSImageProcessor({
    width: 185,
    quality: "best"
});

processor.convert("./in.png", "./processed.png").then(path => {
    if(path) {
        console.log(`Processed image saved to ${path}, printing...`);

        processor.print(device, printer);
    } else {
        console.log("An Error Occurred");
}).catch(error => console.error(error));
```

## License

`escpos-image-processor` is licensed under the MIT License.
