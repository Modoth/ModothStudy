class App {
  constructor() {
    /**@type { Object.<string,HTMLElement> } */
    this.components
    /**@type { Storage | {  } } */
    this.storage
    registerProperties(this, 'menus', 'fileName')
  }
  initData() {}

  start() {
    this.fileSelector = new FileSelector()
    this.resizeWatcher = new ResizeWatcher()
    this.resizeWatcher.register(() => {
      ;[this.components.editedFile].forEach((canvas) => fitCanvas(canvas))
    })
    this.fileNameMenu = new MenuItem('打开', () => {
      this.fileSelector.selectFile(
        'image/*',
        'DataURL',
        this.loadFile_.bind(this)
      )
    })

    this.menus = [
      this.fileNameMenu,
      new MenuItem('测试', () => this.test()),
      new MenuItem('红色', () => this.setRed()),
      new MenuItem('绿色', () => this.addRed()),
      new MenuItem('重置', () => this.resetImage()),
    ]
  }

  async loadFile_(
    /**@type { { file:File, data:ArrayBuffer } } */ { file, data }
  ) {
    this.fileNameMenu.name = file.name || '打开'
    this.fileData = data
    this.oriImageData = await loadImageData(this.fileData)
    this.resetImage()
    fitCanvas(this.components.editedFile)
  }

  cloneImgData(imgData) {
    var newImgData = new ImageData(
      new Uint8ClampedArray(imgData.data),
      imgData.width,
      imgData.height
    )
    return newImgData
  }

  resetImage() {
    if (!this.oriImageData) {
      return
    }
    this.setEditedImgData(this.cloneImgData(this.oriImageData))
  }

  setRed() {
    if (!this.editedImgData) {
      return
    }
    for (var i = 0; i < this.editedImgData.height; i += 2) {
      for (var j = 0; j < this.editedImgData.width; j += 2) {
        var idx = (i * this.editedImgData.width + j) * 4
        this.editedImgData.data[idx + 1] = 0
        this.editedImgData.data[idx + 2] = 0
      }
    }
    this.setEditedImgData(this.editedImgData)
  }

  test() {
    if (!this.editedImgData) {
      return
    }
    console.time()
    let newImgData = new ImageData(
      this.editedImgData.width,
      this.editedImgData.height
    )
    let dw = 4
    for (var i = dw; i < newImgData.height - dw; i += 1) {
      for (var j = dw; j < newImgData.width - dw; j += 1) {
        let indx = (i * newImgData.width + j) * 4
        let r = 0
        let g = 0
        let b = 0
        let a = 0
        let count = 0
        for (let h = i - dw; h <= i + dw; h++) {
          for (let w = j - dw; w <= j + dw; w++) {
            let id = (h * this.editedImgData.width + w) * 4
            let weight = 3 * dw - Math.abs(h - i) - Math.abs(w - j)
            r += this.editedImgData.data[id] * weight
            g += this.editedImgData.data[id + 1] * weight
            b += this.editedImgData.data[id + 2] * weight
            a += this.editedImgData.data[id + 3] * weight
            count += weight
          }
        }
        newImgData.data[indx] = r / count
        newImgData.data[indx + 1] = g / count
        newImgData.data[indx + 2] = b / count
        newImgData.data[indx + 3] = a / count
      }
    }
    console.timeEnd()
    this.setEditedImgData(newImgData)
  }

  addRed() {
    if (!this.editedImgData) {
      return
    }
    var iOffset = Math.floor(this.editedImgData.height * 0.05)
    var jOffset = Math.floor(this.editedImgData.width * 0.05)
    var newImgData = new ImageData(
      this.editedImgData.width - jOffset,
      this.editedImgData.height - iOffset
    )
    for (var i = 0; i < newImgData.height; i++) {
      for (var j = 0; j < newImgData.width; j++) {
        var idx = (i * newImgData.width + j) * 4
        var oidx = (i * this.editedImgData.width + j) * 4
        var nidx = ((i + iOffset) * this.editedImgData.width + j + jOffset) * 4
        newImgData.data[idx] = this.editedImgData.data[oidx]
        newImgData.data[idx + 1] =
          Math.floor(
            this.editedImgData.data[oidx + 1] +
              this.editedImgData.data[nidx + 1]
          ) / 2
        newImgData.data[idx + 2] = this.editedImgData.data[oidx + 2]
        newImgData.data[idx + 3] = this.editedImgData.data[oidx + 3]
      }
    }
    this.setEditedImgData(newImgData)
  }

  setEditedImgData(imgData) {
    this.editedImgData = imgData
    var canvas = this.components.editedFile
    canvas.width = this.editedImgData.width
    canvas.height = this.editedImgData.height
    var ctx = canvas.getContext('2d')
    ctx.putImageData(this.editedImgData, 0, 0)
  }

  resizeCanvas(canvas) {
    if (canvas.width <= 0) {
      return
    }
    canvas.style.width = ''
    canvas.style.height = ''
    setTimeout(() => {
      if (window.innerHeight > window.innerWidth) {
        let width = parseInt(getComputedStyle(canvas).width)
        let height = (width * canvas.height) / canvas.width
        canvas.style.height = Math.floor(height) + 'px'
      } else {
        let height = parseInt(getComputedStyle(canvas).height)
        let width = (height * canvas.width) / canvas.height
        canvas.style.width = Math.floor(width) + 'px'
      }
    }, 0)
  }
}

import { FileSelector } from '../commons/file-selector.js'
import { ResizeWatcher } from '../commons/resize-watcher.js'
import { loadImageData } from '../commons/load-imagedata.js'
import { fitCanvas } from '../commons/fit-canvas.js'
