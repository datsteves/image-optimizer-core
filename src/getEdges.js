// @flow
import cv from 'opencv'
import getPixels from 'get-pixels'

import { flatten, isBlack } from './utiles'

export default async (buf: Buffer): Promise<number> => {
  const newBuf = await flatten(buf)
  return new Promise((resolve: Function) => {
    cv.readImage(newBuf, (err: ?Error, mat: any) => {
      if (err) {
        throw new Error(err)
      }
      mat.convertGrayscale()
      mat.canny(1, 40)
      mat.houghLinesP()

      const matBuf = mat.toBuffer()
      getPixels(matBuf, 'image/jpeg', (er: ?Error, pixels: any) => {
        if (er) {
          throw new Error(er)
        }
        const totalPixels = pixels.data.length / 4
        let blackPixel = 0
        for (let i = 0; i < pixels.data.length; i += 4) {
          if (isBlack(
            pixels.data[i],
            pixels.data[i + 1],
            pixels.data[i + 2],
            pixels.data[i + 3],
          )) { blackPixel += 1 }
        }
        resolve(blackPixel / totalPixels)
      })
    })
  })
}
