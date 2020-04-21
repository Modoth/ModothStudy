import { DragMoveCanvas } from '../commons/drag-move-canvas.js'
import { Modal } from '../modal/index.js'
import { FlexBitmap } from '../commons/flex-bitmap.js'
import { ColorPaletteFactory } from '../commons/color-palette-factory.js'
import { readFile } from '../commons/readFile.js'
import { loadImageData } from '../commons/load-imagedata.js'

class App {
  constructor() {
    /**@type HTMLElement*/
    this.root
  }
  async initComponents() {
    const appStyle = /**@imports css */ './app.css'
    const iptFile = document.createElement('input')
    iptFile.type = 'file'
    iptFile.accept = 'image/*'
    iptFile.classList.add('hidden')
    iptFile.onchange = this.loadFile_.bind(this)
    this.root.appendChild(iptFile)
    this.root.appendChild(appStyle)
    this.iptFile_ = iptFile
    const menuItems = [
      {
        name: '清空',
        onclick: this.clear_.bind(this),
      },
      {
        name: '预览',
        onclick: this.export_.bind(this),
      },
      {
        name: '导入',
        onclick: this.import_.bind(this),
      },
    ]
    const menu = document.createElement('div')
    menu.classList.add('menu')
    menuItems.forEach((m) => {
      const item = document.createElement('div')
      item.onclick = (ev) => {
        ev.stopPropagation()
        m.onclick()
      }
      item.classList.add('menu-item')
      item.innerText = m.name
      menu.appendChild(item)
    })
    const paletteStyle = /**@imports css */ './palette.css'
    this.colors_ = [
      '#00000000',
      '#ccccccff',
      '#99cc66ff',
      '#ccccffff',
      '#cccc99ff',
      '#ffccccff',
      '#99ccccff',
      '#ffffccff',
      '#e9ae6aff',
      '#cc9999ff',
    ]
    const palette = new ColorPaletteFactory().create(
      this.colors_,
      '#00000000',
      this.selectColor_.bind(this)
    )
    palette.classList.add('palette')
    const popupRoot = document.createElement('div')
    popupRoot.onclick = () => this.closePopup && this.closePopup()
    popupRoot.classList.add('popup-root')
    popupRoot.appendChild(palette)
    popupRoot.appendChild(menu)
    popupRoot.appendChild(paletteStyle)
    this.popupRoot_ = popupRoot
    this.modal_ = new Modal()
    this.ratio_ = Math.min(window.devicePixelRatio, 2)
    this.maxWidth_ = 2048
    this.maxHeight_ = 2048
    this.dragMoveCanvas_ = new DragMoveCanvas(
      0.5,
      0.5,
      this.getRgba_.bind(this),
      this.root,
      this.ratio_
    )
  }

  clear_() {
    this.closePopup()
    this.newImage_()
    this.redraw_()
  }

  async loadFile_() {
    const file = this.iptFile_.files[0]
    if (!file) {
      return
    }
    const fileContent = await readFile(file, 'DataURL')
    const imgData = await loadImageData(fileContent)
    await this.loadImageData_(imgData)
  }

  async loadImageData_(/**@type ImageData */ imgData) {
    const scale = Math.max(
      1,
      imgData.width / this.maxWidth_,
      imgData.height / this.maxHeight_
    )
    const width = Math.floor(imgData.width / scale)
    const height = Math.floor(imgData.height / scale)
    const data = imgData.data
    const newBitmaps = new FlexBitmap(width, height)
    for (let j = 0; j < height; j++) {
      const fixJ = Math.floor(j * scale)
      for (let i = 0; i < width; i++) {
        const idx = (Math.floor(i * scale) + fixJ * imgData.width) * 4
        let r = data[idx] << 24
        if (r < 0) {
          r += 0x100000000
        }
        const color =
          r + (data[idx + 1] << 16) + (data[idx + 2] << 8) + data[idx + 3]
        newBitmaps.set(i, j, color)
      }
    }
    this.bitmaps = newBitmaps
    this.redraw_()
  }

  async import_() {
    this.closePopup()
    if (window.$localStorage) {
      const res = await window.$localStorage.openFile('image/*', 'DataURL')
      if (res) {
        const imgData = await loadImageData(res.data)
        await this.loadImageData_(imgData)
      }
    } else {
      this.iptFile_.click()
    }
  }

  getPreviewImage_(ppw, pph, dx, dy, sourceData) {
    if (ppw < 1 || pph < 1 || dx < 0 || dy < 0) {
      return null
    }
    const width = sourceData.width * ppw + 2 * dx
    const height = sourceData.height * pph + 2 * dy
    if (width >= this.maxWidth_ || height > this.maxHeight_) {
      return null
    }
    const imageData = new ImageData(width, height)
    for (let j = 0; j < sourceData.height; j++) {
      for (let i = 0; i < sourceData.width; i++) {
        const sourceIdx = (j * sourceData.width + i) * 4
        const r = sourceData.data[sourceIdx]
        const g = sourceData.data[sourceIdx + 1]
        const b = sourceData.data[sourceIdx + 2]
        const a = sourceData.data[sourceIdx + 3]
        for (let n = 0; n < pph; n++) {
          for (let m = 0; m < ppw; m++) {
            const idx = (dx + i * ppw + m + (dy + j * pph + n) * width) * 4
            imageData.data[idx] = r
            imageData.data[idx + 1] = g
            imageData.data[idx + 2] = b
            imageData.data[idx + 3] = a
          }
        }
      }
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imageData, 0, 0)
    const imgUrl = canvas.toDataURL()
    return { width, height, imgUrl }
  }

  getPreviewImageData_() {
    const [top, right, bottom, left] = this.bitmaps.getRegion()
    const width = right - left
    const height = bottom - top
    if (!width || !height) {
      return
    }

    const imageData = new ImageData(width, height)
    for (let y = 0; y < bottom - top; y++) {
      for (let x = 0; x < right - left; x++) {
        const color = this.bitmaps.get(x + left, y + top)
        const r = (color >> 24) & 0xff
        const g = (color >> 16) & 0xff
        const b = (color >> 8) & 0xff
        const a = color & 0xff
        const idx = (x + y * width) * 4
        imageData.data[idx] = r
        imageData.data[idx + 1] = g
        imageData.data[idx + 2] = b
        imageData.data[idx + 3] = a
      }
    }
    return imageData
  }

  createPreviewPanel_(imageData, onclose) {
    const root = document.createElement('div')
    root.onclick = onclose
    const shadow = root.attachShadow({ mode: 'closed' })
    const style = /**@imports css */ './preview.css'
    shadow.appendChild(style)
    const preview = document.createElement('div')
    preview.classList.add('preview')
    const menu = document.createElement('div')
    const previewImg = document.createElement('img')
    previewImg.classList.add('preview-img')
    let config = {
      ppw: 1,
      pph: 1,
      dx: 0,
      dy: 0,
    }
    let width = 0
    let height = 0
    let imgUrl = ''
    const configsStack = []
    const changeImg = (ppw, pph, dx, dy) => {
      const img = this.getPreviewImage_(ppw, pph, dx, dy, imageData)
      if (!img) {
        return false
      }
      config = { ppw, pph, dx, dy }
      ;({ width, height, imgUrl } = img)
      previewImg.width = width / this.ratio_
      previewImg.height = height / this.ratio_
      previewImg.src = imgUrl
      a.href = previewImg.src
      return true
    }
    preview.onclick = (ev) => {
      ev.stopPropagation()
    }
    const a = document.createElement('a')
    a.classList.add('hidden')
    a.download = '预览.png'
    menu.appendChild(a)
    const menuItems = [
      {
        name: '加大',
        onclick: () => {
          const his = config
          changeImg(
            config.ppw * 2,
            config.pph * 2,
            config.dx + config.ppw * 2,
            config.dy + config.pph * 2
          ) && configsStack.push(his)
        },
      },
      {
        name: '减小',
        onclick: () => {
          let config = configsStack.pop()
          config && changeImg(config.ppw, config.pph, config.dx, config.dy)
        },
      },
      {
        name: '下载',
        onclick: () => {
          a.click()
        },
      },
      {
        name: '关闭',
        onclick: () => {
          onclose && onclose()
        },
      },
    ]
    menu.classList.add('menu')
    menuItems.forEach((m) => {
      const item = document.createElement('div')
      item.onclick = (ev) => {
        ev.stopPropagation()
        m.onclick()
      }
      item.classList.add('menu-item')
      item.innerText = m.name
      menu.appendChild(item)
    })
    shadow.appendChild(preview)
    preview.appendChild(previewImg)
    preview.appendChild(menu)
    changeImg(config.ppw, config.pph, config.dx, config.dy) &&
      configsStack.push(config)
    return root
  }

  async export_() {
    this.closePopup()
    const img = this.getPreviewImageData_()
    if (!img || img.width == 0 || img.height === 0) {
      return
    }
    let resolve
    const root = this.createPreviewPanel_(img, () => resolve())
    await this.modal_.popup(root, (r) => (resolve = r), false)
  }

  resizeCanvas_(width, height) {
    this.displayWidth = Math.ceil(width / this.ppw)
    this.displayHeight = Math.ceil(height / this.pph)
    this.redraw_()
  }

  moveCanvasBy_(dpx, dpy) {
    this.offsetPx += dpx
    this.offsetPy += dpy
    this.redraw_()
  }

  selectColor_(selectedColor) {
    if (!selectedColor) {
      this.closePopup()
      return
    }
    const { x, y } = this
    const newColor = parseInt(selectedColor.replace(/^#/, ''), 16)
    this.bitmaps.set(x, y, newColor)
    this.dragMoveCanvas_.draw(
      x * this.ppw - this.offsetPx,
      y * this.pph - this.offsetPy,
      this.ppw,
      this.pph
    )
    this.closePopup()
  }

  async changeCurrentPosition_(px, py) {
    const [x, y] = this.getMapPosition_(px, py)
    this.x = x
    this.y = y
    if (x < 0 || y < 0) {
      return
    }
    await this.modal_.popup(
      this.popupRoot_,
      (closeModal) => (this.closePopup = closeModal),
      false
    )
  }

  getRgbaFromUint32_(color) {
    return [24, 16, 8, 0].map((offset) => (color >> offset) & 0xff)
  }

  getMapPosition_(px, py) {
    const x = Math.floor((px + this.offsetPx) / this.ppw)
    const y = Math.floor((py + this.offsetPy) / this.pph)
    return [x, y]
  }

  getRgba_(px, py) {
    const [x, y] = this.getMapPosition_(px, py)
    const color = this.bitmaps.get(x, y)
    return this.getRgbaFromUint32_(color)
  }

  redraw_() {
    this.dragMoveCanvas_.redraw({
      x: this.offsetPx,
      y: this.offsetPy,
      width: this.ppw,
      height: this.pph,
    })
  }

  async newImage_() {
    this.bitmaps = new FlexBitmap(90, 90, 100)
  }

  async start() {
    this.dragMoveCanvas_.onMoved = this.moveCanvasBy_.bind(this)
    this.dragMoveCanvas_.onSizeChange = this.resizeCanvas_.bind(this)
    this.dragMoveCanvas_.onClick = this.changeCurrentPosition_.bind(this)
    this.offsetPx = 0
    this.offsetPy = 0
    this.ppw = 24
    this.pph = 24
    this.newImage_()
    this.resizeCanvas_(this.dragMoveCanvas_.width, this.dragMoveCanvas_.height)
  }
}
