export class QrCodeData {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.data = new Uint8Array(this.width * this.height)
  }
}

export class QrCodeGenerator {
  generate(/**@type string */ content) {
    const length = Math.min(10, content.length)
    const qr = new QrCodeData(length, length)
    for (let j = 0; j < length; j++) {
      for (let i = 0; i < length; i++) {
        qr.data[i + length * j] = Math.random() > 0.7 ? 1 : 0
      }
    }
    return qr
  }
}
