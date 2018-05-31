// @flow
import fs from 'fs'
import fileType from 'file-type'
import imagemin from 'imagemin'
import mozjpeg from 'imagemin-mozjpeg'
import imageminWebP from 'imagemin-webp'
import getEdges from './getEdges'
import { isBuffer } from './utiles'

type BufferObjectType = {
  output: Buffer,
  saved: number
};

type OutputMimeType = 'image/jpeg' | 'image/webp';
type InputMimeType = 'image/jpeg';

// for now we only support JPEG's
const validMimes = [
  'image/jpeg',
]

function compressToBuffer(
  file: Buffer,
  inputMime: InputMimeType,
  outputType: string,
): Promise<Buffer> {
  return getEdges(file, inputMime)
    .then(async (quality: number): Promise<Buffer> => {
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
          quality: (quality * 85) - 4,
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
    throw new Error('Inputpath isnt a JP(E)G')
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
