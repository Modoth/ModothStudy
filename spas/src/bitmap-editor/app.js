import { DragMoveCanvas } from '../commons/drag-move-canvas.js'
import { Modal } from '../modal/index.js'
import { FlexBitmap } from '../commons/flex-bitmap.js'
import { ColorPaletteFactory } from '../commons/color-palette-factory.js'

class App {
  constructor() {
    /**@type HTMLElement*/
    this.root
  }
  async initComponents() {
    const menuItems = [
      {
        name: '清空',
        onclick: this.mClear.bind(this),
      },
      {
        name: '预览',
        onclick: this.mExport.bind(this),
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
    const style = document.createElement('style')
    style.innerHTML = `
:{

}
.menu{
  align-items: center;
  align-content: space-between;
  padding: 5px;
  margin: 0px 10%;
  background: #fff8;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  display: flex;
  background: #fffe;
  z-index:1;
}
.menu-item{
  margin:5px auto;
  padding:5px 10px;
}
`
    this.mColors = [
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
      this.mColors,
      '#00000000',
      this.mSelectColor.bind(this)
    )
    const popupRoot = document.createElement('div')
    popupRoot.onclick = () => this.closePopup && this.closePopup()
    popupRoot.style.display = 'flex'
    popupRoot.style.justifyContent = 'center'
    popupRoot.style.flexDirection = 'column'
    popupRoot.style.width = '100%'
    popupRoot.style.height = '100%'

    popupRoot.appendChild(palette)
    popupRoot.appendChild(menu)
    popupRoot.appendChild(style)
    this.mPopupRoot = popupRoot
    this.mModal = new Modal()
    this.mRatio = Math.min(window.devicePixelRatio, 2)
    this.mDragMoveCanvas = new DragMoveCanvas(
      0.5,
      0.5,
      this.mGetRgba.bind(this),
      this.root,
      this.mRatio
    )
  }

  mClear() {
    this.closePopup()
    this.mNewImage()
    this.mRedraw()
  }

  async mImport() {
    
  }

  async mExport() {
    this.closePopup()
    const [top, right, bottom, left] = this.bitmaps.getRegion()
    const ppw = this.ppw * this.mRatio
    const pph = this.pph * this.mRatio
    const dx = ppw
    const dy = pph
    const width = (right - left) * ppw + 2 * dx
    const height = (bottom - top) * pph + 2 * dy
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
        for (let j = 0; j < pph; j++) {
          for (let i = 0; i < ppw; i++) {
            const idx = (i + dx + x * ppw + (j + dy + y * pph) * width) * 4
            imageData.data[idx] = r
            imageData.data[idx + 1] = g
            imageData.data[idx + 2] = b
            imageData.data[idx + 3] = a
          }
        }
      }
    }
    let resolve
    const root = document.createElement('div')
    root.style.flex = '1'
    root.style.display = 'flex'
    root.style.alignItems = 'center'
    root.onclick = () => resolve()
    const preview = document.createElement('div')
    preview.style.margin = '0 auto'
    preview.style.padding = '20px'
    preview.style.background = 'white'
    preview.style.borderRadius = '8px'
    preview.style.boxShadow = '1px 1px 3px'
    preview.style.boxSizing = 'border-box'

    const a = document.createElement('a')
    a.download = '预览.png'
    const previewImg = document.createElement('img')
    previewImg.width = width / this.mRatio
    previewImg.height = height / this.mRatio
    previewImg.style.maxWidth = '75vw'
    previewImg.style.maxHeight = '75vh'
    previewImg.style.backgroundImage = `linear-gradient(
      45deg,
      #0001 25%,
      transparent 25%,
      transparent 75%,
      #0001 75%,
      #0001
      ),
    linear-gradient(
      45deg,
      #0001 26%,
      transparent 26%,
      transparent 74%,
      #0001 74%,
      #0001
    )`
    previewImg.style.backgroundSize = '20px 20px'
    previewImg.style.backgroundPosition = '0 0, 10px 10px'

    preview.onclick = (ev) => {
      ev.stopPropagation()
      // const s = window.getSelection()
      // s.removeAllRanges()
      // const r = new Range()
      // r.selectNode(previewImg)
      // s.addRange(r)
      // document.execCommand('copy')
      // this.mModal.toast('已复制')
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imageData, 0, 0)
    previewImg.src = canvas.toDataURL()
    a.href = previewImg.src
    root.appendChild(preview)
    preview.appendChild(a)
    a.appendChild(previewImg)
    await this.mModal.popup(root, (r) => (resolve = r), false)
  }

  mResizeCanvas(width, height) {
    this.displayWidth = Math.ceil(width / this.ppw)
    this.displayHeight = Math.ceil(height / this.pph)
    this.mRedraw()
  }

  mMoveCanvasBy(dpx, dpy) {
    this.offsetPx += dpx
    this.offsetPy += dpy
    this.mRedraw()
  }

  mSelectColor(selectedColor) {
    if (!selectedColor) {
      this.closePopup()
      return
    }
    const { x, y } = this
    const newColor = parseInt(selectedColor.replace(/^#/, ''), 16)
    this.bitmaps.set(x, y, newColor)
    this.mDragMoveCanvas.draw(
      x * this.ppw - this.offsetPx,
      y * this.pph - this.offsetPy,
      this.ppw,
      this.pph
    )
    this.closePopup()
  }

  async mChangeCurrentPosition(px, py) {
    const [x, y] = this.mGetMapPosition(px, py)
    this.x = x
    this.y = y
    if (x < 0 || y < 0) {
      return
    }
    await this.mModal.popup(
      this.mPopupRoot,
      (closeModal) => (this.closePopup = closeModal),
      false
    )
  }

  mGetRgbaFromUint32(color) {
    return [24, 16, 8, 0].map((offset) => (color >> offset) & 0xff)
  }

  mGetMapPosition(px, py) {
    const x = Math.floor((px + this.offsetPx) / this.ppw)
    const y = Math.floor((py + this.offsetPy) / this.pph)
    return [x, y]
  }

  mGetRgba(px, py) {
    const [x, y] = this.mGetMapPosition(px, py)
    const color = this.bitmaps.get(x, y)
    return this.mGetRgbaFromUint32(color)
  }
  mRedraw() {
    this.mDragMoveCanvas.redraw({
      x: this.offsetPx,
      y: this.offsetPy,
      width: this.ppw,
      height: this.pph,
    })
  }

  async mNewImage() {
    this.bitmaps = new FlexBitmap(90, 90, 100)
  }

  async start() {
    this.mDragMoveCanvas.onMoved = this.mMoveCanvasBy.bind(this)
    this.mDragMoveCanvas.onSizeChange = this.mResizeCanvas.bind(this)
    this.mDragMoveCanvas.onClick = this.mChangeCurrentPosition.bind(this)
    this.offsetPx = 0
    this.offsetPy = 0
    this.ppw = 24
    this.pph = 24
    this.mNewImage()
    this.mResizeCanvas(this.mDragMoveCanvas.width, this.mDragMoveCanvas.height)
  }
}
