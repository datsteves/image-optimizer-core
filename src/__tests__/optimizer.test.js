import fs from 'fs'
import fileType from 'file-type'
import optimizer from './../'
import { isBuffer } from './../utiles'

describe('CORE: Optimizer', () => {
  it('should optimize jpeg from string and save it to a File (File => File)', async () => {
    const saved = await optimizer(`${__dirname}/test-image.jpg`)
      .toFile(`${__dirname}/test-result-1.jpg`)

    expect(saved).toBeTruthy()
    const fileExists = fs.existsSync(`${__dirname}/test-result-1.jpg`)
    expect(fileExists).toBe(true)

    // clean up
    if (fs.existsSync(`${__dirname}/test-result-1.jpg`)) {
      fs.unlinkSync(`${__dirname}/test-result-1.jpg`)
    }
  })

  it('should optimize jpeg from string and save it to Buffer (File => Buffer)', async () => {
    await optimizer(`${__dirname}/test-image.jpg`)
      .toBuffer()
      .then(({ output, saved }) => {
        expect(isBuffer(output)).toBe(true)
        expect(saved).toBeTruthy()
      })
  })

  it('should optimize jpeg from Buffer and save it to a File (Buffer => File)', async () => {
    const file = fs.readFileSync(`${__dirname}/test-image.jpg`)
    const saved = await optimizer(file)
      .toFile(`${__dirname}/test-result-2.jpg`)

    expect(saved).toBeTruthy()
    const fileExists = fs.existsSync(`${__dirname}/test-result-2.jpg`)
    expect(fileExists).toBe(true)

    // clean up
    if (fs.existsSync(`${__dirname}/test-result-2.jpg`)) {
      fs.unlinkSync(`${__dirname}/test-result-2.jpg`)
    }
  })

  it('should optimize jpeg from Buffer and save it to Buffer (Buffer => Buffer)', async () => {
    const file = fs.readFileSync(`${__dirname}/test-image.jpg`)
    await optimizer(file)
      .toBuffer()
      .then(({ output, saved }) => {
        expect(isBuffer(output)).toBe(true)
        expect(saved).toBeTruthy()
      })
  })

  it('shouldnt except numbers, bools and strings that arent a jpeg path', async () => {
    expect(() => {
      optimizer(`${__dirname}/test.gif`)
    }).toThrowError('Inputpath isnt a JP(E)G or a PNG')

    expect(() => {
      optimizer('a great random string to insert and test the project')
    }).toThrowError('Input isnt a path/file')

    expect(() => {
      optimizer(234523523)
    }).toThrowError('Input is not a valid Object (Buffer or filepath)')

    expect(() => {
      optimizer(false)
    }).toThrowError('Input is not a valid Object (Buffer or filepath)')
  })

  it('should make multiple files with given option', async () => {
    const files = [
      {
        path: `${__dirname}/result.jpg`,
        type: 'image/jpeg',
      },
      {
        path: `${__dirname}/result.webp`,
        type: 'image/webp',
      },
    ]
    optimizer(`${__dirname}/test-image.jpg`)
      .toFiles({
        files,
      })
      .then((result) => {
        expect(result).toHaveLength(files.length)
        files.forEach((elem) => {
          const fileExists = fs.existsSync(elem.path)
          expect(fileExists).toBe(true)
          // clean up
          if (fs.existsSync(elem.path)) {
            fs.unlinkSync(elem.path)
          }
        })
      })
  })

  it('should optimize PNG to JPEG (Buffer => Buffer)', async () => {
    const file = fs.readFileSync(`${__dirname}/test.png`)
    await optimizer(file)
      .toBuffer('image/jpeg')
      .then(({ output, saved }) => {
        const { mime } = fileType(output)
        expect(mime).toBe('image/jpeg')
        expect(saved).toBeGreaterThan(0.4)
      })
  })

  it('should optimize PNG to WebP (Buffer => Buffer)', async () => {
    const file = fs.readFileSync(`${__dirname}/test.png`)
    await optimizer(file)
      .toBuffer('image/webp')
      .then(({ output, saved }) => {
        const { mime } = fileType(output)
        expect(mime).toBe('image/webp')
        expect(saved).toBeGreaterThan(0.4)
      })
  })

  it('should optimize JPEG to WebP (Buffer => Buffer)', async () => {
    const file = fs.readFileSync(`${__dirname}/test-image.jpg`)
    await optimizer(file)
      .toBuffer('image/webp')
      .then(({ output, saved }) => {
        const { mime } = fileType(output)
        expect(mime).toBe('image/webp')
        expect(saved).toBeGreaterThan(0.4)
      })
  })
})
