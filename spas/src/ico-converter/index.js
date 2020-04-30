class App {
  constructor() {
    /**@type { Object.<string,HTMLElement> } */
    this.components
    /**@type { Storage | {  } } */
    this.storage
    registerProperties(this, 'menus', 'fileName')
  }

  start() {
    this.fileSelector = new FileSelector()
    this.resizeWatcher = new ResizeWatcher()
    this.resizeWatcher.register(() => this.resizeCanvas())
    this.sizes = [16, 32, 64, 128, 256]
    this.fileNameMenu = new MenuItem('打开', () => {
      this.fileSelector.selectFile(
        'image/*',
        'DataURL',
        this.loadFile_.bind(this)
      )
    })
    this.downloadMenu = new MenuItem('下载', () =>
      downloadDataUrl(this.downloadLink)
    )
    this.updateMenu()
    this.loadFile_(this.data)
  }

  updateMenu(maxSize = Infinity) {
    this.menus = [
      this.fileNameMenu,
      this.downloadMenu,
      ...this.sizes
        .filter((size) => size < maxSize)
        .map((size) => new MenuItem(size, () => this.resize(size))),
    ]
  }

  async loadFile_(
    /**@type { { file:File, data:ArrayBuffer } } */ { file, data }
  ) {
    this.fileNameMenu.name = file.name || '打开'
    this.fileData = data
    this.oriImageData = await loadImageData(this.fileData)
    this.updateMenu(Math.min(this.oriImageData.width, this.oriImageData.height))
    await this.updateCanvas(this.oriImageData)
    this.resize(
      Math.min(this.sizes[0], this.oriImageData.width, this.oriImageData.height)
    )
  }

  async resize(size) {
    if (size === 0 || this.oriImageData == null) {
      return
    }
    const resizedImg = resizeImageData(this.oriImageData, size)
    this.editedImgData = resizedImg
    if (this.downloadLink) {
      window.URL.revokeObjectURL(this.downloadLink)
    }
    this.downloadLink = await generateIconUrl(resizedImg)
    this.components.editedFile.src = this.downloadLink
  }

  async resizeCanvas() {
    await fitCanvas(this.components.srcFile)
    this.components.editedFile.style.width = getComputedStyle(
      this.components.srcFile
    ).width
    this.components.editedFile.style.height = getComputedStyle(
      this.components.srcFile
    ).height
  }

  async updateCanvas(imgData) {
    this.components.srcFile.width = imgData.width
    this.components.srcFile.height = imgData.height
    let ctx = this.components.srcFile.getContext('2d')
    ctx.putImageData(imgData, 0, 0)
    await this.resizeCanvas()
  }
}

import { FileSelector } from '../commons/file-selector.js'
import { ResizeWatcher } from '../commons/resize-watcher.js'
import { loadImageData } from '../commons/load-imagedata.js'
import { generateIconUrl } from '../commons/generate-icon-url.js'
import { resizeImageData } from '../commons/resize-imagedata.js'
import { downloadDataUrl } from '../commons/download-dataurl.js'
import { fitCanvas } from '../commons/fit-canvas.js'
