# Image Optimizer Core

This Package optimizes your images and adjust the quality automatically.
So no standard 80% Quality on your JPEG's.


## Install

please have a look at the instruction of [node-opencv](https://github.com/peterbraden/node-opencv) to install opencv on your machine.

```bash
$ npm install image-optimizer-core
```

## Usage

```js

const optimizer = require('image-optimizer-core')

// using files
optimizer('path/to/file.jpg')
    .toFile('output.jpg')

// using Buffer
optimizer(buffer)
    .toBuffer()
    .then(output => {
        // ...
    })

//You even get the saved kb back as a percentage
optimizer('example.jpg')
    .toBuffer()
    .then(buffer, saved => {
        console.log(saved) // 0.72345 ... so it saved you 72.345%
    })

```

## API

### optimizer(input)

Returns `toBuffer` and `toFile`

#### input

Type: `Buffer` or `String`

### toBuffer()

Returns `Promise<Buffer>, <saved>`

### toFile(ouput)

Returns `Promise<saved>`

#### output

Type: `String`

#### saved

Type: `Float`

This is the Percentage that this lib safed you in a number between `0-1`