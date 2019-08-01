import ESCPOSImageProcessor from '../dist'

const processor = new ESCPOSImageProcessor({
    width: 185
})

processor.convert('./dog.jpg', './processed.png').then(path => {
    console.log(`Processed image saved to ${path}`)
}).catch(err => {
    console.error(err)
})