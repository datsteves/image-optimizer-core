const cv = require('opencv')
const getPixels = require('get-pixels')

module.exports = (buf, type) => {
    return new Promise((resolve)=>{

        cv.readImage(buf, (err, mat)=>{
            mat.convertGrayscale()
            mat.canny(1, 40)
            mat.houghLinesP()
    
            const matBuf = mat.toBuffer()
            getPixels(matBuf, type, (err, pixels)=>{
                const totalPixels = pixels.data.length / 4
                let blackPixel = 0
                for(let i = 0; i < pixels.data.length; i += 4) {
                    if(isBlack(pixels.data[i],pixels.data[i+1],pixels.data[i+2],pixels.data[i+3]))
                        blackPixel += 1
                }
                resolve(blackPixel/totalPixels)
            })
        })
    })
}

function isBlack(r,g,b,a) {
    if(r <= 30 && g <= 30 && b <= 30 && a == 255) {
        return true
    } 
    return false
}