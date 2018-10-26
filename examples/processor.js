const ESCPOSImageProcessor = require("../index.js");

const processor = new ESCPOSImageProcessor({
    width: 185
});

processor.convert("./dog.jpg", "./processed.png", path => {
    if(path) {
        console.log(`Processed image saved to ${path}`);
    } else {
        console.log("An Error Occurred");
    }
});