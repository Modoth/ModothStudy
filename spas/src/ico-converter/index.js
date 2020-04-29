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
      ;[this.components.srcFile, this.components.editedFile].forEach((canvas) =>
        this.resizeCanvas(canvas)
      )
    })
    this.sizes = [16, 64, 256]
    this.fileNameMenu = new MenuItem('打开', () => {
      this.fileSelector.selectFile(
        'image/*',
        'DataURL',
        this.loadFile_.bind(this)
      )
    })

    this.menus = [
      this.fileNameMenu,
      new MenuItem('下载', () => downloadDataUrl(this.downloadLink)),
      ...this.sizes.map((size) => new MenuItem(size, () => this.resize(size))),
    ]
  }

  async loadFile_(
    /**@type { { file:File, data:ArrayBuffer } } */ { file, data }
  ) {
    this.fileNameMenu.name = file.name || ''
    this.fileData = data
    this.oriImageData = await loadImageData(this.fileData)
    this.updateCanvas(this.components.srcFile, this.oriImageData)
    this.resize(this.sizes[0])
  }

  async resize(size) {
    if (
      size === 0 ||
      this.oriImageData == null ||
      size > Math.min(this.oriImageData.width, this.oriImageData.height)
    ) {
      return
    }
    const resizedImg = resizeImageData(this.oriImageData, size)
    this.editedImgData = resizedImg
    this.updateCanvas(this.components.editedFile, resizedImg)
    this.downloadLink = await generateIconFromCanvas(this.components.editedFile)
  }

  updateCanvas(canvas, imgData) {
    canvas.width = imgData.width
    canvas.height = imgData.height
    let ctx = canvas.getContext('2d')
    ctx.putImageData(imgData, 0, 0)
    this.resizeCanvas(canvas)
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
import { generateIconFromCanvas } from '../commons/generate-icon-from-canvas.js'
import { resizeImageData } from '../commons/resize-imagedata.js'
import { downloadDataUrl } from '../commons/download-dataurl.js'
