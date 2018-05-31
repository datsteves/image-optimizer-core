const optimzer = require('./../build')
// import optimzer from './../src'

optimzer(`${__dirname}/image.jpg`)
  .toFile('my-jpeg-image.jpg', 'image/jpeg')
  .then((saved) => {
    console.log('I saved you', saved * 100, '%')
  })

optimzer(`${__dirname}/image.jpg`)
  .toFile('my-webp-image.webp', 'image/webp')
  .then((saved) => {
    console.log('I saved you', saved * 100, '%')
  })
