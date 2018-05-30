import fs from 'fs'
import optimizer from './../'
import { isBuffer } from './../utiles'

describe('main test', () => {
  it('should optimize jpeg from string and save it to a File (File => File)', async () => {
    const saved = await optimizer(`${__dirname}/test-image.jpg`)
      .toFile(`${__dirname}/test-result-1.jpg`)

    expect(saved).toBeTruthy()
    const fileExists = fs.existsSync(`${__dirname}/test-result-1.jpg`)
    expect(fileExists).toBe(false)

    // clean up
    if (fs.existsSync(`${__dirname}/test-result-1.jpg`)) {
      fs.unlinkSync(`${__dirname}/test-result-1.jpg`)
    }
  })

  it('should optimize jpeg from string and save it to Buffer (File => Buffer)', async () => {
    await optimizer(`${__dirname}/test-image.jpg`)
      .toBuffer((buf, saved) => {
        expect(isBuffer(buf)).toBe(true)
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
      .toBuffer((buf, saved) => {
        expect(isBuffer(buf)).toBe(true)
        expect(saved).toBeTruthy()
      })
  })

  it('shouldnt except numbers, bools and strings that arent a jpeg path', async () => {
    expect(() => {
      optimizer(`${__dirname}/test.png`)
    }).toThrowError('Inputpath isnt a JP(E)G')

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
})
