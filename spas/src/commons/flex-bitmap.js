import { assertPara } from '../commons/assert.js'
import { nameof } from '../commons/nameof.js'
import { remainDevide } from '../commons/remain-devide.js'

export class FlexBitmap {
  constructor(width, height, bufferSize = 10) {
    assertPara(width >= 0, nameof({ width }))
    assertPara(height >= 0, nameof({ height }))
    this.mBufferSize = parseInt(bufferSize)
    assertPara(this.mBufferSize > 0, nameof({ bufferSize }))
    /**@type [any]*/
    this.mBuffers = []
    this.mInterWidth = 0
    this.mBufferPerRow = 0
    this.width = 0
    this.height = 0
    this.mGuaranteeSize(width - 1, height - 1)
  }

  mGuaranteeSize(x, y) {
    if (x < this.width && y < this.height) {
      return
    }
    if (x >= this.width) {
      this.width = x + 1
    }
    if (this.width > this.mInterWidth) {
      const bufferPerRow = Math.max(Math.ceil(this.width / this.mBufferSize), 1)
      const newBuffers = []
      for (let j = 0; j < this.height; j++) {
        for (let i = 0; i < this.mBufferPerRow; i++) {
          newBuffers.push(this.mBuffers[i + j * this.mBufferPerRow])
        }
        for (let i = this.mBufferPerRow; i < bufferPerRow; i++) {
          newBuffers.push(new Uint32Array(this.mBufferSize))
        }
      }
      this.mBufferPerRow = bufferPerRow
      this.mInterWidth = bufferPerRow * this.mBufferSize
      this.mBuffers = newBuffers
    }
    if (y >= this.height) {
      const newHeight = y + 1
      this.mBuffers.push(
        ...Array.from(
          { length: (newHeight - this.height) * this.mBufferPerRow },
          () => new Uint32Array(this.mBufferSize)
        )
      )
      this.height = newHeight
    }
  }

  mNonEmptyRow(scanInverse = false) {
    for (let j = 0; j < this.height; j++) {
      let fixJ = scanInverse ? this.height - 1 - j : j
      for (let k = 0; k < this.mBufferPerRow; k++) {
        const buffer = this.mBuffers[k + this.mBufferPerRow * fixJ]
        for (let i = 0; i < this.mBufferSize; i++) {
          if (buffer[i] & 0xff) {
            return fixJ
          }
        }
      }
    }
  }

  mNonEmptyColumn(scanInverse = false) {
    for (let k = 0; k < this.mBufferPerRow; k++) {
      let fixK = scanInverse ? this.mBufferPerRow - 1 - k : k
      for (let i = 0; i < this.mBufferSize; i++) {
        let fixI = scanInverse ? this.mBufferSize - 1 - i : i
        for (let j = 0; j < this.height; j++) {
          const buffer = this.mBuffers[fixK + this.mBufferPerRow * j]
          if (buffer[fixI] & 0xff) {
            return fixK * this.mBufferSize + fixI
          }
        }
      }
    }
  }

  getRegion() {
    let top = this.mNonEmptyRow()
    let bottom = this.mNonEmptyRow(true) + 1
    let left = this.mNonEmptyColumn()
    let right = this.mNonEmptyColumn(true) + 1
    return [top, right, bottom, left]
  }

  get(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined
    }
    const [rowBufferIdx, offset] = remainDevide(x, this.mBufferSize)
    return this.mBuffers[y * this.mBufferPerRow + rowBufferIdx][offset]
  }

  set(x, y, value) {
    this.mGuaranteeSize(x, y)
    const [rowBufferIdx, offset] = remainDevide(x, this.mBufferSize)
    this.mBuffers[y * this.mBufferPerRow + rowBufferIdx][offset] = value
  }

  toString() {
    const rows = []
    for (let j = 0; j < this.height; j++) {
      let row = []
      for (let k = 0; k < this.mBufferPerRow; k++) {
        const buffer = this.mBuffers[k + this.mBufferPerRow * j]
        for (let i = 0; i < this.mBufferSize; i++) {
          if (i + k * this.mBufferSize >= this.width) {
            row.push(''.padStart(8, 'x'))
          } else {
            row.push(buffer[i].toString('16').padStart(8, '0'))
          }
        }
      }
      rows.push(row.join('\t'))
    }
    return rows.join('\n')
  }
}
