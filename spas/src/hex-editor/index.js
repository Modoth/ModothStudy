class App {
  constructor() {
    /**@type { Object.<string,HTMLElement> } */
    this.components
    /**@type { Storage | {  } } */
    this.storage
    registerProperties(
      this,
      'menus',
      'fileName',
      'lines',
      'currentPage',
      'totalPage'
    )
  }
  initData() {}
  start() {
    this.fileSelector = new FileSelector()
    this.resizeWatcher = new ResizeWatcher()
    this.resizeWatcher.register(setTimeout(this.repage.bind(this), 50))
    this.fileNameMenu = new MenuItem('打开', this.openFile_.bind(this))
    this.currentPageMenu = new MenuItem('0/0', () => {})
    this.menus = [
      new MenuItem('上一页', () => this.gotoPage(this.currentPage - 1)),
      this.fileNameMenu,
      this.currentPageMenu,
      new MenuItem('下一页', () => this.gotoPage(this.currentPage + 1)),
    ]
    this.minCharWidth = 32
    this.minCharHeight = 32
    this.validCharsPerLines = [8, 16, 32, 64]
    this.charsPerLine = 16
    this.linesPerPage = 20
    this.totalLine = 0
    this.totalPage = 0
    this.currentPage = 0
    this.lines = []
  }
  openFile_() {
    this.fileSelector.selectFile('*', 'ArrayBuffer', this.loadFile_.bind(this))
  }

  gotoPage(page) {
    if (page < 0 || page >= this.totalPage) {
      return
    }
    this.currentPage = page
    this.currentPageMenu.name = `${this.currentPage + 1}/${this.totalPage}`
    const startLine = this.currentPage * this.linesPerPage
    const startChar = startLine * this.linesPerPage
    const linesCurrentPage = Math.min(
      this.totalLine - startLine,
      this.linesPerPage
    )
    const emptyLines = this.linesPerPage - linesCurrentPage
    const lines = Array.from(
      { length: linesCurrentPage },
      (_, i) =>
        new Line(
          new Uint8Array(
            this.fileData,
            startChar + i * this.charsPerLine,
            startChar + i * this.charsPerLine + this.charsPerLine >
            this.fileData.byteLength
              ? undefined
              : this.charsPerLine
          ),
          this.charsPerLine
        )
    )
    this.lines = [
      ...lines,
      ...Array.from({ length: emptyLines }, () => new Line()),
    ]
  }

  repage() {
    if (!this.fileData) {
      return
    }
    const pageElement = this.components.page
    for (const charsPerLine of this.validCharsPerLines) {
      if (charsPerLine * this.minCharWidth < pageElement.clientWidth) {
        this.charsPerLine = charsPerLine
      } else {
        break
      }
    }
    this.linesPerPage = Math.floor(
      pageElement.clientHeight / this.minCharHeight
    )
    this.totalLine = Math.ceil(this.fileData.byteLength / this.charsPerLine)
    this.totalPage = Math.ceil(this.totalLine / this.linesPerPage)
    this.gotoPage(0)
  }

  async loadFile_(
    /**@type { { file:File, data:ArrayBuffer } } */ { file, data }
  ) {
    this.fileNameMenu.name = file.name
    this.fileData = data
    this.repage()
  }
}

class Line {
  constructor(/**@type UInt8Array */ data, /**@type number */ length) {
    if (!data) {
      this.chars = []
      return
    }
    const chars = Array.prototype.map.call(data, (c) => new Char(c))
    this.chars =
      chars.length === length
        ? chars
        : [
            ...chars,
            ...Array.from({ length: length - chars.length }, () => new Char()),
          ]
  }
}

class Char {
  constructor(/**@type number */ code = -1) {
    this.code = code
    if (this.code === -1) {
      this.content = ''
      this.string = ''
      return
    }
    this.content = this.code.toString(16).padStart(2, '0')
    this.string = String.fromCharCode(this.code).trim() || '.'
  }
}

import { FileSelector } from '../commons/file-selector.js'
import { ResizeWatcher } from '../commons/resize-watcher.js'
