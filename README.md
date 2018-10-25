# escpos-image-processor
A Node.JS program that turns an image from a path into an escpos-printable image.

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