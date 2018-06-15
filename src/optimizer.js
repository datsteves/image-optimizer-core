// @flow
import fs from 'fs'
import fileType from 'file-type'
import imagemin from 'imagemin'
import mozjpeg from 'imagemin-mozjpeg'
import imageminWebP from 'imagemin-webp'
import imageminPngquant from 'imagemin-pngquant'
import getEdges from './getEdges'
import { isBuffer, clampNumber, flatten } from './utiles'

type BufferObjectType = {
  output: Buffer,
  saved: number
};

type OutputMimeType = 'image/jpeg' | 'image/webp' | 'image/png';
type InputMimeType = 'image/jpeg' | 'image/png';

// for now we only support JPEG's
const validMimes = [
  'image/jpeg',
  'image/png',
]

function compressToBuffer(
  file: Buffer,
  inputMime: InputMimeType,
  outputType: OutputMimeType,
): Promise<Buffer> {
  return getEdges(file)
    .then(async (quality: number): Promise<Buffer> => {
      let toProcessFile = file
      const plugins = []
      switch (outputType) {
      case 'image/jpeg':
        plugins.push(mozjpeg({
          quality: (quality * 84) - 4,
          dcScanOpt: 2,
          smooth: 0,
          quantTable: 1,
          tune: 'ssim',
        }))
        if (inputMime === 'image/png') {
          // we have to flatten PNG's first, otherwise imagemin cant process that file
          toProcessFile = await flatten(file)
        }
        break
      case 'image/webp':
        plugins.push(imageminWebP({
          quality: (quality * 85) - 4,
        }))
        break
      case 'image/png':
        plugins.push(imageminPngquant({
          floyd: 1,
          quality: clampNumber(Math.ceil(quality * 100), 0, 100),
          speed: 1,
        }))
        break
      default:
        console.warn('something weird happend')
      }
      return imagemin.buffer(
        toProcessFile,
        {
          plugins,
        },
      )
    })
}

function optimizer(input: string | Buffer): Object {
  let file
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
  if (!file) {
    throw new Error('Some Error happend?')
  }
  const { mime } = fileType(file)
  if (!validMimes.includes(mime)) {
    throw new Error('Inputpath isnt a JP(E)G or a PNG')
  }

  return {
    toBuffer: (outputType: OutputMimeType = mime): Promise<BufferObjectType> =>
      compressToBuffer(file, mime, outputType)
        .then((output: Buffer): Promise<BufferObjectType> => new Promise((resolve: Function) => {
          const saved = 1 - (output.length / file.length)
          resolve({ output, saved })
        })),
    toFile: (path: string, outputType: OutputMimeType = mime): Promise<number> =>
      compressToBuffer(file, mime, outputType)
        .then((output: Buffer): Promise<number> => new Promise((resolve: Function) => {
          const saved = 1 - (output.length / file.length)
          fs.writeFileSync(path, output)
          resolve(saved)
        })),
    toFiles: (options: Object): Promise<Array<number>> => {
      const { files } = options
      let promisses = []
      promisses = files.map((elem: Object): Promise<number> =>
        compressToBuffer(file, mime, elem.type)
          .then((output: Buffer): Promise<number> => new Promise((resolve: Function) => {
            const saved = 1 - (output.length / file.length)
            fs.writeFileSync(elem.path, output)
            resolve(saved)
          })))
      return Promise.all(promisses)
    },
  }
}

export default optimizer
