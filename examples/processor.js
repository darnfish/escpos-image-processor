const ESCPOSImageProcessor = require("../index.js");

const processor = new ESCPOSImageProcessor({
    width: 185
});

processor.convert("./dog.jpg", "./processed.png", path => {
    processor.print(device, printer);
});