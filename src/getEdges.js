// @flow
import cv from 'opencv'
import getPixels from 'get-pixels'


function isBlack(r: number, g: number, b: number, a: number): boolean {
  if (r <= 30 && g <= 30 && b <= 30 && a === 255) {
    return true
  }
  return false
}

export default (buf: Buffer, type: string): Promise<number> => new Promise((resolve: Function) => {
  cv.readImage(buf, (err: ?Error, mat: any) => {
    mat.convertGrayscale()
    mat.canny(1, 40)
    mat.houghLinesP()

    const matBuf = mat.toBuffer()
    getPixels(matBuf, type, (er: ?Error, pixels: any) => {
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
