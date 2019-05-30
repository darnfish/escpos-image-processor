# @printurmessages/escpos-image-processor
A Node library that converts an image from a saved path into an escpos-printable image.

## Installation
This library is available on the [NPM registry](https://npmjs.org). To install, run

```
npm install @printurmessages/escpos-image-processor --save
```
If you're using [Yarn](https://yarnpkg.com), run
```
yarn add @printurmessages/escpos-image-processor
```

## Usage

```javascript
// Import the package
import ESCPOSImageProcessor from '@printurmessages/escpos-image-processor'

// Create an instance of the class
const processor = new ESCPOSImageProcessor({
    width: 185, /* optional, defaults to 185 (default 40mm printer roll width in px) */
    quality: 'best' /* optional, defaults to 'best' (slowest). another option is 'good', which is faster but produces worse results */
})

// Put the path to your image in the first parameter ('.in.png') and put the location where the image should be saved in the second parameter ('./processed.png').
processor.convert('./in.png', './processed.png').then(path => {
    // The callback will return the path if all went well, if there was an error it will return 'false'.
    if(path) {
        console.log(`Processed image saved to ${path}`)
    } else {
        console.log('An Error Occurred')
    }
}).catch(error => console.error(error))
```
## Usage with `escpos`
If you wish to use `escpos-image-processor` with the `escpos` module, look at the example below:

```javascript
import escpos from 'escpos'
import ESCPOSImageProcessor from '@printurmessages/escpos-image-processor'

const device  = new escpos.USB()
const printer = new escpos.Printer(device)

const processor = new ESCPOSImageProcessor({
    width: 185,
    quality: 'best'
})

processor.convert('./in.png', './processed.png').then(path => {
    if(path) {
        console.log(`Processed image saved to ${path}, printing...`)

        processor.print(device, printer)
    } else {
        console.log('An Error Occurred')
}).catch(error => console.error(error))
```

## License
`escpos-image-processor` is licensed under the MIT License.
