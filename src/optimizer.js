import fs from 'fs'
import fileType from 'file-type'
import imagemin from 'imagemin'
import mozjpeg from 'imagemin-mozjpeg'
import imageminWebP from 'imagemin-webp'
import getEdges from './getEdges'
import { isBuffer } from './utiles'

// for now we only support JPEG's
const validMimes = [
  'image/jpeg',
]

function compressToBuffer(file, inputMime, outputType) {
  return getEdges(file, inputMime)
    .then(async (quality) => {
      const plugins = []

      if (outputType === 'image/jpeg') {
        plugins.push(mozjpeg({
          quality: (quality * 80) - 4,
          dcScanOpt: 2,
          smooth: 0,
          quantTable: 1,
          tune: 'ssim',
        }))
      } else if (outputType === 'image/webp') {
        plugins.push(imageminWebP({
          quality: (quality * 100) - 4,
        }))
      }

      return imagemin.buffer(
        file,
        {
          plugins,
        },
      )
    })
}

function optimizer(input) {
  let file = null
  if (typeof (input) === 'string') {
    if (!fs.existsSync(input)) {
      throw new Error('Input isnt a path/file')
    }
    file = fs.readFileSync(input)
  } else if (isBuffer(input)) {
    file = input
  } else {
    throw new Error('Input is not a valid Object (Buffer or filepath)')
  }
  const { mime } = fileType(file)
  if (!validMimes.includes(mime)) {
    throw new Error('Inputpath isnt a JP(E)G')
  }

  return {
    toBuffer: () => compressToBuffer(file, mime, mime)
      .then(output => new Promise((resolve) => {
        const saved = 1 - (output.length / file.length)
        resolve({ output, saved })
      })),
    toFile: (path, outputType = mime) => compressToBuffer(file, mime, outputType)
      .then(output => new Promise((resolve) => {
        const saved = 1 - (output.length / file.length)
        fs.writeFileSync(path, output)
        resolve(saved)
      })),
    toFiles: (options) => {
      const { files } = options
      let promisses = []
      promisses = files.map(elem => compressToBuffer(file, mime, elem.type)
        .then(output => new Promise((resolve) => {
          const saved = 1 - (output.length / file.length)
          fs.writeFileSync(elem.path, output)
          resolve(saved)
        })))
      return Promise.all(promisses)
    },
  }
}

export default optimizer
