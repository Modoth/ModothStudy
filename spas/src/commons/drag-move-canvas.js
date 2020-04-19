import { ResizeWatcher } from './resize-watcher.js'
import { registerDragMove } from './register-drag-move.js'

export class DragMoveCanvas {
  constructor(bufferX, bufferY, getRgba, root, ratio) {
    this.mBufferX = bufferX
    this.mBufferY = bufferY
    this.mGetRgba = getRgba
    this.mRoot = root
    this.mRatio = ratio
    const backgroundCanvas = document.createElement('canvas')
    this.mRoot.appendChild(backgroundCanvas)
    this.mBackgroundCanvas = backgroundCanvas
    this.mBackgroundCanvas.style.position = 'absolute'
    const canvas = document.createElement('canvas')
    this.mRoot.appendChild(canvas)
    this.mRoot.style.overflow = 'hidden'
    this.mCanvas = canvas
    this.mUpdateCanvasSize()
    new ResizeWatcher(window).register(this.mUpdateCanvasSize.bind(this))
    this.mCanvasContext = this.mCanvas.getContext('2d')
    this.mBackgroundCanvasContext = this.mBackgroundCanvas.getContext('2d')
    this.mRegisterCanvasDrag()
  }

  mRegisterCanvasDrag() {
    let start
    let dx = 0
    let dy = 0
    let threshold = 1
    this.mCanvas.onclick = (ev) =>
      this.onClick && this.onClick(ev.clientX, ev.clientY)
    registerDragMove(
      document,
      this.mCanvas,
      (pos) => (start = pos),
      (pos) => {
        dx = pos.screenX - start.screenX
        dy = pos.screenY - start.screenY
        this.mCanvas.style.transform = `translate(${dx - this.mOffsetX}px,${
          dy - this.mOffsetY
        }px)`
        this.mBackgroundCanvas.style.transform = `translate(${
          dx - this.mOffsetX
        }px,${dy - this.mOffsetY}px)`
      },
      () => {
        if (Math.abs(dx) + Math.abs(dy) > threshold && this.onMoved) {
          this.onMoved(Math.floor(-dx), Math.floor(-dy))
          dx = 0
          dy = 0
        }
      }
    )
  }

  mUpdateCanvasSize() {
    this.width = this.mRoot.clientWidth
    this.height = this.mRoot.clientHeight
    this.mOffsetX = Math.floor(this.width * this.mBufferX)
    this.mOffsetY = Math.floor(this.height * this.mBufferY)
    this.mCanvasWidth = this.width + 2 * this.mOffsetX
    this.mCanvas.width = this.mCanvasWidth * this.mRatio
    this.mCanvasHeight = this.height + 2 * this.mOffsetY
    this.mCanvas.height = this.mCanvasHeight * this.mRatio
    this.mCanvas.style.width = this.mCanvasWidth
    this.mCanvas.style.height = this.mCanvasHeight
    this.mBackgroundCanvas.width = this.mCanvas.width
    this.mBackgroundCanvas.style.width = this.mCanvas.style.width
    this.mBackgroundCanvas.height = this.mCanvas.height
    this.mBackgroundCanvas.style.height = this.mCanvas.style.height
    if (this.onSizeChange) {
      this.onSizeChange(this.width, this.height)
    }
  }

  mDrawGrid({ x, y, width, height }) {
    this.mBackgroundCanvasContext.clearRect(
      0,
      0,
      this.mBackgroundCanvas.width,
      this.mBackgroundCanvas.height
    )
    this.mBackgroundCanvasContext.strokeStyle = '#8884'
    const dx = (this.mOffsetX - x) % width
    const dy = (this.mOffsetY - y) % height
    this.mBackgroundCanvasContext.beginPath()

    for (
      let y = dy * this.mRatio;
      y < this.mBackgroundCanvas.height;
      y += height * this.mRatio
    ) {
      this.mBackgroundCanvasContext.moveTo(0, y)
      this.mBackgroundCanvasContext.lineTo(this.mBackgroundCanvas.width, y)
    }
    for (
      let x = dx * this.mRatio;
      x < this.mBackgroundCanvas.width;
      x += width * this.mRatio
    ) {
      this.mBackgroundCanvasContext.moveTo(x, 0)
      this.mBackgroundCanvasContext.lineTo(x, this.mBackgroundCanvas.height)
    }
    this.mBackgroundCanvasContext.stroke()
  }

  redraw(grid) {
    console.log('redraw')
    if (grid) {
      this.mDrawGrid(grid)
    }
    this.mCanvas.style.transform = `translate(${-this.mOffsetX}px,${-this
      .mOffsetY}px)`
    this.mBackgroundCanvas.style.transform = `translate(${-this
      .mOffsetX}px,${-this.mOffsetY}px)`
    this.draw(
      -this.mOffsetX,
      -this.mOffsetY,
      this.mCanvasWidth,
      this.mCanvasHeight
    )
  }

  draw(x, y, width, height) {
    const px = Math.floor(x * this.mRatio)
    const py = Math.floor(y * this.mRatio)
    const pwidth = Math.floor((x + width) * this.mRatio) - px
    const pheight = Math.floor((y + height) * this.mRatio) - py
    const imgData = new ImageData(pwidth, pheight)
    for (let j = 0; j < pheight; j++) {
      for (let i = 0; i < pwidth; i++) {
        const bits = this.mGetRgba(
          Math.floor((px + i) / this.mRatio),
          Math.floor((py + j) / this.mRatio)
        )
        let idx = (i + j * pwidth) * 4
        imgData.data[idx] = bits[0]
        imgData.data[idx + 1] = bits[1]
        imgData.data[idx + 2] = bits[2]
        imgData.data[idx + 3] = bits[3]
      }
    }
    this.mCanvasContext.putImageData(
      imgData,
      Math.floor((x + this.mOffsetX) * this.mRatio),
      Math.floor((y + this.mOffsetY) * this.mRatio)
    )
  }
}
