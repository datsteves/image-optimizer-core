// @flow

export function isBuffer(obj: any): boolean {
  return obj != null && obj.constructor != null &&
        typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}
export default {
  isBuffer,
}
