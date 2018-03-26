const fs = require('fs')
const imagemin = require('imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const getEdges = require('./getEdges')

function isBuffer(obj) {
  return obj != null && obj.constructor != null &&
      typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

function compressToBuffer(file) {
  return getEdges(file, 'image/jpeg')
    .then(quality => imagemin.buffer(
      file,
      {
        plugins: [
          mozjpeg({
            quality: (quality * 80) - 4,
            dcScanOpt: 2,
            smooth: 0,
            quantTable: 1,
            tune: 'ssim',
          }),
        ],
      },
    ))
}


module.exports = (input) => {
  let file = null
  if (typeof (input) === 'string') {
    file = fs.readFileSync(input)
  } else if (!isBuffer(input)) {
    throw new Error('Input is not a valid Object (Buffer or filepath)')
  }

  return {
    toBuffer: () => compressToBuffer(file)
      .then(output => new Promise((resolve) => {
        const saved = 1 - (output.length / file.length)
        resolve(output, saved)
      })),
    toFile: path => compressToBuffer(file)
      .then(output => new Promise((resolve) => {
        const saved = 1 - (output.length / file.length)
        fs.writeFileSync(path, output)
        resolve(saved)
      })),
  }
}
