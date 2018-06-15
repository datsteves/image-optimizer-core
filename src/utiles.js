// @flow

import gm from 'gm'

export function flatten(buf: Buffer): Promise<Buffer> {
  return new Promise((resolve: Function, reject: Function) => {
    gm(buf)
      .flatten()
      .toBuffer('JPG', (err: ?Error, buffer: Buffer) => {
        if (err) {
          reject(err)
        }
        resolve(buffer)
      })
  })
}

export function isBlack(r: number, g: number, b: number, a: number): boolean {
  if (r <= 30 && g <= 30 && b <= 30 && a === 255) {
    return true
  }
  return false
}

export function isBuffer(obj: any): boolean {
  return obj != null && obj.constructor != null &&
        typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export default {
  isBuffer,
  isBlack,
  clampNumber,
  flatten,
}
