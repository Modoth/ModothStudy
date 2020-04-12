import { sleep } from '../commons/sleep.js'

class LineInfo {
  constructor(
    /**@type number */ x,
    /**@type number */ y,
    /**@type number */ ymin,
    /**@type number */ yRealMin,
    /**@type number */ yRealMax,
    /**@type number */ offset,
    /**@type string */ text
  ) {
    this.x = x
    this.y = y
    this.ymin = ymin
    this.yRealMax = yRealMax
    this.yRealMin = yRealMin
    this.offset = offset
    this.text = text
  }
}

export class TextRender {
  constructor(/**@type HTMLElement*/ root) {
    this.mRoot = root
    this.mCanvas = document.createElement('canvas')
    this.mMeasureCanvas = document.createElement('canvas')
    this.mCanvas.onclick = (ev) => this.mOnMouseClick(ev)
    this.mCanvas.onmousedown = (ev) => this.mOnMouseDown(ev)
    this.mCanvas.onmousemove = (ev) => this.mOnMouseMove(ev)
    this.mCanvas.onmouseup = (ev) => this.mOnMouseUp(ev)
    this.mCanvas.onmouseleave = (ev) => this.mOnMouseUp(ev)
    this.mRoot.appendChild(this.mCanvas)
    /**@type LineInfo[] */
    this.mLineInfos = []
    this.mMovingCheckPeriod = 200
  }

  mOnMouseClick() {
    if (this.mAllowCancleSelection) {
      this.mSelect(null, null)
    }
  }

  mOnMouseDown(ev) {
    this.mIsMouseDown = true
    setTimeout(() => {
      if (!this.mIsMouseDown) {
        return
      }
      this.mIsSelecting = true
      this.mAllowCancleSelection = false
      this.mLastMovingCheck = 0
      this.mMouseDownChar = { toGetFrom: ev }
    }, 300)
  }

  mOnMouseMove(ev) {
    if (!this.mIsSelecting) {
      return
    }
    const now = Date.now()
    if (now - this.mLastMovingCheck < this.mMovingCheckPeriod) {
      return
    }
    this.mLastMovingCheck = now
    if (this.mMouseDownChar.toGetFrom) {
      this.mMouseDownChar = this.mFindCharAt(this.mMouseDownChar.toGetFrom)
      return
    }
    this.mMouseChar = this.mFindCharAt(ev)
    this.mMouseChar && this.mSelect(this.mMouseDownChar, this.mMouseChar)
  }

  mOnMouseUp(/**@type MouseEvent */ ev) {
    this.mIsMouseDown = false
    this.mMouseDownChar = null
    if (this.mIsSelecting) {
      this.mIsSelecting = false
      this.mSelection = this.mGetSelection(
        this.mHightlightStartChar,
        this.mHightlightEndChar
      )
      setTimeout(() => {
        this.mAllowCancleSelection = true
        if (this.onSelectChange) {
          this.onSelectChange(this.mSelection)
        }
      }, 0)
    }
  }

  mGetHighlightSlices(start, end) {
    const redraws = []
    if (start.y === end.y) {
      const left = Math.min(start.x, end.x)
      const right = Math.max(start.x, end.x)
      if (left > 0) {
        redraws.push({
          x: 0,
          y: start.y,
          xend: left,
          hightlight: 0,
        })
      }
      redraws.push({
        x: left,
        y: start.y,
        xend: right + 1,
        hightlight: 1,
      })
      redraws.push({
        x: right + 1,
        y: start.y,
        hightlight: 0,
      })
    } else {
      let bottom, top
      if (start.y > end.y) {
        bottom = start
        top = end
      } else {
        bottom = end
        top = start
      }
      redraws.push({
        x: 0,
        y: top.y,
        xend: top.x,
        hightlight: 0,
      })
      redraws.push({
        x: top.x,
        y: top.y,
        hightlight: 1,
      })
      for (let i = top.y + 1; i < bottom.y; i++) {
        redraws.push({
          x: 0,
          y: i,
          hightlight: 1,
        })
      }
      redraws.push({
        x: 0,
        y: bottom.y,
        xend: bottom.x + 1,
        hightlight: 1,
      })
      redraws.push({
        x: bottom.x + 1,
        y: bottom.y,
        hightlight: 0,
      })
    }
    return redraws
  }

  mResetHighlight(start, end, clearOnly) {
    let top = start.y
    let bottom = end.y
    this.mContext.clearRect(
      this.mLineInfos[top].x,
      this.mLineInfos[top].ymin,
      this.mCanvas.width,
      this.mLineInfos[bottom].yRealMax - this.mLineInfos[top].ymin
    )
    if (clearOnly) {
      return
    }
    for (let i = top; i <= bottom; i++) {
      const line = this.mLineInfos[i]
      this.mContext.fillText(line.text, line.x, line.y)
    }
  }

  mHightlight(start, end) {
    this.mResetHighlight(start, end, true)
    const slices = this.mGetHighlightSlices(start, end)
    const style = this.mContext.fillStyle
    const hightlightStyle = this.mHightlightColor

    for (const i of slices) {
      this.mContext.fillStyle = i.hightlight ? hightlightStyle : style
      const line = this.mLineInfos[i.y]
      const offset =
        line.x + this.mContext.measureText(line.text.slice(0, i.x)).width
      this.mContext.fillText(line.text.slice(i.x, i.xend), offset, line.y)
    }

    this.mContext.fillStyle = style
  }

  mSort(start, end) {
    if (!start || !end) {
      return [null, null]
    }
    if (start.y == end.y) {
      if (start.x > end.x) {
        return [end, start]
      } else {
        return [start, end]
      }
    }
    if (start.y > end.y) {
      return [end, start]
    } else {
      return [start, end]
    }
  }

  mGetSelection(start, end) {
    if (!start || !end) {
      return null
    }
    const startLine = this.mLineInfos[start.y]
    const endLine = this.mLineInfos[end.y]
    const offset = startLine.offset + start.x
    const endOffset = endLine.offset + end.x + 1
    const text = this.mContent.slice(offset, endOffset)
    const length = text.length
    return {
      offset,
      text,
      length,
    }
  }

  mSelect(start, end) {
    ;[start, end] = this.mSort(start, end)
    if (
      start &&
      end &&
      this.mHightlightStartChar &&
      this.mHightlightStartChar.x == start.x &&
      this.mHightlightStartChar.y == start.y &&
      this.mHightlightEndChar &&
      this.mHightlightEndChar.x === end.x &&
      this.mHightlightEndChar.y === end.y
    ) {
      return
    }

    this.mHightlightStartChar &&
      this.mHightlightEndChar &&
      this.mResetHighlight(this.mHightlightStartChar, this.mHightlightEndChar)

    this.mHightlightStartChar = start
    this.mHightlightEndChar = end
    this.mHightlightStartChar &&
      this.mHightlightEndChar &&
      this.mHightlight(this.mHightlightStartChar, this.mHightlightEndChar)
  }

  mFindCharAt({ x: canvasX, y: canvasY }) {
    const y = this.mLineInfos.findIndex(
      (l) => l.yRealMax > canvasY && l.yRealMin < canvasY
    )
    const line = this.mLineInfos[y]
    if (!line) {
      return null
    }
    const char = this.mGetLength(
      this.mContext,
      line.text,
      canvasX,
      this.mFullLineLength,
      this.mPerWidth
    )
    let x = char.length - 1
    return { x, y }
  }

  mGetOneLine(/**@type string */ content, /**@type number */ offset) {
    let end = offset
    while (content[end] && content[end] !== '\n') {
      end++
    }
    return [
      content.slice(offset, content[end - 1] === '\r' ? end - 1 : end),
      end + 1,
    ]
  }

  mGetLength(ctx, p, pageWidth, fullLineLength, perWidth) {
    let res = this.mFindMax(
      0,
      p.length,
      fullLineLength,
      pageWidth,
      perWidth,
      (x, y, dx) => {
        const next = x + dx
        const abs_dy = ctx.measureText(
          dx > 0 ? p.slice(x, next) : p.slice(next, x)
        ).width
        y = dx > 0 ? y + abs_dy : y - abs_dy
        return { x: next, y }
      }
    )
    return {
      length: res.x,
      fullLineLength: res.xinit,
      perWidth: res.k,
      width: res.y,
    }
  }

  mFindMax(
    xmin,
    xmax,
    xinit,
    ymax,
    k,
    /**@type {( x:number,  y:number, dx:number)=>{x:number, y:number}}*/ f
  ) {
    let dx = xinit
    let x = 0
    let y = 0
    let [min, max] = [xmin, xmax]
    let comfirmMax = false
    let comfirmMin = false
    let remainTimes = 1000
    let checkMax = false
    while (true) {
      if (remainTimes-- < 0) {
        throw 'timeout'
      }
      ;({ x, y } = f(x, y, dx))
      k = y / x
      let dy = ymax - y
      if (dy == 0) {
        if (x > xmax) {
          x = xmax
          break
        } else {
          xinit = x
          break
        }
      }
      if (dy > 0) {
        if (x > xmax) {
          x = xmax
          break
        }
        if (dx == -1) {
          xinit = x
          break
        }
        min = Math.max(min, x)
        comfirmMin = true
        dx = Math.ceil(dy / k)
      } else {
        if (dx == 1) {
          x--
          xinit = x
          break
        }
        comfirmMax = true
        max = Math.min(max, x)
        dx = Math.floor(dy / k)
      }
      if (!checkMax && max == min + 1) {
        dx = max - x
        checkMax = true
        continue
      }
      if (max <= min + 1) {
        x = min
        xinit = x
        break
      }
      if (comfirmMax && comfirmMin) {
        dx = Math.floor((max + min) / 2) - x
      } else {
        dx = Math.min(max - x, dx)
        dx = Math.max(min - x, dx)
      }
    }
    return { x, xinit, y, k }
  }

  mMeasurePage(
    /**@tye HTMLCanvasElement */ canvas,
    /**@type string */ content,
    /**@type number */ offset,
    /**@type number */ fontSize,
    /**@type string */ fontFamily,
    /**@type number */ clientWidth,
    /**@type number */ clientHeight,
    /**@type number */ lineHeight,
    padding,
    includeLineInfo = true,
    hightLimit = true
  ) {
    const lineInfos = []
    canvas.width = clientWidth
    canvas.height = clientHeight
    let pageWidth = canvas.width - padding.left - padding.right
    let pageHeight = canvas.height - padding.top - padding.bottom
    let pOffset = offset
    let p
    const ctx = canvas.getContext('2d')
    ctx.font = `${fontSize}px ${fontFamily}`
    let xLength = ctx.measureText('x').width
    let top = padding.top + lineHeight
    let lowestTop = padding.top + pageHeight
    let fullLineLength = Math.floor(pageWidth / xLength)
    let perWidth = xLength
    while (true) {
      offset = pOffset
      ;[p, pOffset] = this.mGetOneLine(content, pOffset)
      while (p.length) {
        const info = this.mGetLength(
          ctx,
          p,
          pageWidth,
          fullLineLength,
          perWidth
        )
        fullLineLength = info.fullLineLength
        perWidth = info.perWidth
        includeLineInfo &&
          lineInfos.push(
            new LineInfo(
              padding.left,
              top,
              top - lineHeight,
              top - fontSize,
              top + fontSize * 0.2,
              offset,
              content.slice(offset, offset + info.length)
            )
          )
        offset += info.length
        top += lineHeight
        if ((hightLimit && top > lowestTop) || offset >= content.length) {
          return { offset, lineInfos, fullLineLength, perWidth, top }
        }
        p = p.slice(info.length)
      }
      offset++
      top += padding.para
      if (offset >= content.length || (hightLimit && top > lowestTop)) {
        return { offset, lineInfos, fullLineLength, perWidth, top }
      }
    }
  }

  page(
    /**@type string */ content,
    /**@type number */ offset = 0,
    onpage = null,
    cancleToken = {}
  ) {
    return new Promise(async (resolve) => {
      this.mMeasureCanvas.width = this.mRoot.clientWidth
      this.mMeasureCanvas.height = this.mRoot.clientHeight
      let pageWidth =
        this.mMeasureCanvas.width - this.mPadding.left - this.mPadding.right
      let pageHeight =
        this.mMeasureCanvas.height - this.mPadding.top - this.mPadding.bottom
      const ctx = this.mMeasureCanvas.getContext('2d')
      ctx.font = `${this.mFontSize}px ${this.mFontFamily}`
      let perWidth = ctx.measureText('x').width
      let fullLineLength = Math.floor(pageWidth / perWidth)
      let lineCount = Math.floor(pageHeight / this.mLineHeight)
      this.mFullPageLength = fullLineLength * lineCount
      if (this.mFullPageLength == 0) {
        return
      }
      const offset_bk = offset
      let page = 0
      while (offset < content.length) {
        await sleep(0)
        if (cancleToken.cancled) {
          resolve()
          return
        }
        const pageRes = this.mMeasurePage(
          this.mMeasureCanvas,
          content,
          offset,
          this.mFontSize,
          this.mFontFamily,
          this.mMeasureCanvas.width,
          this.mMeasureCanvas.height,
          this.mLineHeight,
          this.mPadding,
          false,
          true
        )
        onpage && onpage(page, offset)
        offset = pageRes.offset
        page++
      }

      page = 0
      offset = offset_bk
      while (offset > 0) {
        await sleep(0)
        if (cancleToken.cancled) {
          resolve()
          return
        }
        const maxOffset = this.mMeasurePage(
          this.mMeasureCanvas,
          content,
          offset,
          this.mFontSize,
          this.mFontFamily,
          this.mMeasureCanvas.width,
          this.mMeasureCanvas.height,
          this.mLineHeight,
          this.mPadding,
          false,
          true
        ).offset

        const res = this.mFindMax(
          0,
          offset,
          this.mFullPageLength,
          maxOffset - offset,
          maxOffset / this.mFullPageLength,
          (x, _, dx) => {
            x += dx
            const pageRes = this.mMeasurePage(
              this.mMeasureCanvas,
              content,
              offset - x,
              this.mFontSize,
              this.mFontFamily,
              this.mMeasureCanvas.width,
              this.mMeasureCanvas.height,
              this.mLineHeight,
              this.mPadding,
              false,
              true
            )
            return {
              x: x,
              y: maxOffset - pageRes.offset,
            }
          }
        )
        this.mFullPageLength = Math.floor(maxOffset / res.xinit)
        const nextOffset = offset
        offset -= res.x
        page--
        onpage &&
          onpage(page, Math.max(offset, 0), offset > 0 ? nextOffset : undefined)
      }
      resolve()
    })
  }

  setStyle({
    /**@type number */ fontSize,
    /**@type string */ fontFamily,
    /**@type string */ color,
    /**@type string */ hightcolor,
  }) {
    this.mColor = color
    this.mHightlightColor = hightcolor
    this.mFontSize = fontSize
    this.mFontFamily = fontFamily
    this.mLineHeight = fontSize * 1.2
    this.mPadding = {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10,
      para: 0.4 * this.mLineHeight,
    }
  }

  rend(
    /**@type string */ content,
    /**@type number */ offset,
    /**@type number */ nextOffset
  ) {
    this.mContent = content.slice(offset, nextOffset)
    this.mNextOffset = nextOffset
    this.mCanvas.width = this.mRoot.clientWidth
    this.mCanvas.height = this.mRoot.clientHeight
    this.mContext = this.mCanvas.getContext('2d')
    this.mContext.font = `${this.mFontSize}px ${this.mFontFamily}`
    const {
      offset: newOffset,
      lineInfos,
      fullLineLength,
      perWidth,
    } = this.mMeasurePage(
      this.mMeasureCanvas,
      this.mContent,
      0,
      this.mFontSize,
      this.mFontFamily,
      this.mCanvas.width,
      this.mCanvas.height,
      this.mLineHeight,
      this.mPadding
    )
    this.mFullLineLength = fullLineLength
    this.mPerWidth = perWidth
    this.mLineInfos = lineInfos
    this.mContext.fillStyle = this.mColor
    for (const info of this.mLineInfos) {
      this.mContext.fillText(info.text, info.x, info.y)
    }
    return newOffset
  }
}
