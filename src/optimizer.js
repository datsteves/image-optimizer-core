import fs from 'fs'
import imagemin from 'imagemin'
import mozjpeg from 'imagemin-mozjpeg'
import getEdges from './getEdges'
import { isBuffer } from './utiles'

function getFileExtention(input) {
  return /(?:\.([^.]+))?$/.exec(input)[1]
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

function optimizer(input) {
  let file = null
  if (typeof (input) === 'string') {
    if (!fs.existsSync(input)) {
      throw new Error('Input isnt a path/file')
    }
    if (getFileExtention(input) !== 'jpg' && getFileExtention(input) !== 'jpeg') {
      throw new Error('Inputpath isnt a JP(E)G')
    }
    file = fs.readFileSync(input)
  } else if (isBuffer(input)) {
    file = input
  } else {
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

export default optimizer
