# Image Optimizer Core

[![Build Status](https://travis-ci.com/datsteves/image-optimizer-core.svg?branch=master)](https://travis-ci.com/datsteves/image-optimizer-core)

This Package optimizes your images and adjust the quality automatically.
So no standard 80% Quality on your JPEG's.


## Install

please have a look at the instruction of [node-opencv](https://github.com/peterbraden/node-opencv) to install opencv on your machine.

```bash
$ npm install image-optimizer-core
# or with yarn
$ yarn add image-optimizer-core
```

## Usage

```js

import optimizer from 'image-optimizer-core'
// or with the old way
// const optimizer = require('image-optimizer-core')


// using files
optimizer('path/to/file.jpg')
    .toFile('output.jpg')
    .then(saved => {
        console.log('I saved you', saved * 100, '%')
    })

// using Buffer
optimizer(buffer)
    .toBuffer()
    .then(output => {
        // ...
    })

// You even get the saved kb back as a percentage
optimizer('example.jpg')
    .toBuffer()
    .then((buffer, saved) => {
        console.log('saved', saved, '%') // 0.72345 ... so it saved you 72.345%
    })

// or if you want, you can even convert your files
optimizer('example.png')
    .toBuffer('image/webp')
    .then((buffer, saved) => {
        console.log('saved', saved, '%') // 0.72345 ... so it saved you 72.345%
    })

```

## API

### optimizer(input)

Returns `toBuffer` and `toFile`

#### input

Type: `Buffer` or `String`

### toBuffer(outputType)

Returns `Promise<Buffer>, <saved>`

### toFile(ouputPath, outputType)

Returns `Promise<saved>`

#### output

Type: `String`

#### saved

Type: `Float`

This is the Percentage that this lib safed you in a number between `0-1`

### outputType

Type: `String`

can be `image/jpeg` & `image/png` & `image/webp` .

but be aware, we dont support `JPEG => PNG`

## Webpack

if you want to have a webpack loader for it, that uses this package then go to [image-optimizer-webpack-loader](https://github.com/datsteves/image-optimizer-webpack-loader).