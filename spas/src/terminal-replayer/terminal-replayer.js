import { sleep } from '../commons/sleep.js'

class Context {
  constructor() {
    this.currentLine = ''
    this.lines = [this.currentLine]
    this.styles = new Set()
    this.enableCaret = false
    this.caretY = 0
    this.caretX = 0
  }
}

export class TerminalReplayer {
  constructor(option) {
    const { inputCharDelay = 100, outputCharDelay = 5 } = option || {}
    this.mInputCharDelay = inputCharDelay
    this.mOutputCharDelay = outputCharDelay
    this.mRoot = document.createElement('div')
    const shadow = this.mRoot.attachShadow({ mode: 'closed' })
    const style = /**@imports css */ './terminal-replayer.css'
    shadow.appendChild(style)
    this.mScreen = document.createElement('pre')
    this.mScreen.classList.add('screen')
    shadow.appendChild(this.mScreen)
    this.mEscapePrefix = ['\\033', '\\0x1B', '\\0x1b']
    this.mCsiSurfix = 'm'
  }

  get view() {
    return this.mRoot
  }

  mPrintCaret() {
    const e = document.createElement('code')
    e.innerText = '|'
    e.classList.add('caret')
    e.classList.add('hidden')
    this.mScreen.appendChild(e)
    this.mCaret = e
  }

  mClearScreen(/**@type Context */ ctx, type) {
    switch (type) {
      case 1:
        return
      case 2:
        ctx.caretX = 0
        ctx.caretY = 0
        this.mScreen.innerHTML = ''
        this.mScreen.appendChild(this.mCaret)
        this.mRows = [[]]
        return
      default:
        let currentRow = this.mRows[ctx.caretY]
        for (let i = ctx.caretX; i < currentRow.length; i++) {
          this.mScreen.removeChild(currentRow[i])
        }
        this.mRows[ctx.caretY] = currentRow.slice(0, ctx.caretX)
        for (let j = ctx.caretY + 1; j < this.mRows.length; j++) {
          currentRow = this.mRows[j]
          for (let i = 0; i < currentRow.length; i++) {
            this.mScreen.removeChild(currentRow[i])
          }
        }
        this.mRows = this.mRows.slice(0, ctx.caretY + 1)
        return
    }
  }

  mChangeCaretPosition(/**@type Context */ ctx, dx = 0, dy = 0) {
    let nextY = ctx.caretY + (dy || 0)
    let nextX = ctx.caretX + (dx || 0)
    nextY = Math.min(this.mRows.length - 1, nextY)
    nextY = Math.max(0, nextY)
    const row = this.mRows[nextY]
    nextX = Math.min(row.length, nextX)
    nextX = Math.max(0, nextX)
    this.mScreen.removeChild(this.mCaret)
    const nextChar = row[nextX]
    if (nextChar) {
      this.mScreen.insertBefore(this.mCaret, nextChar)
    } else {
      this.mScreen.appendChild(this.mCaret)
    }
    ctx.caretX = nextX
    ctx.caretY = nextY
  }

  mChangeCaretState(/**@type Context */ ctx, enable = false) {
    ctx.enableCaret = enable
    if (enable) {
      this.mCaret.classList.remove('hidden')
    } else {
      this.mCaret.classList.add('hidden')
    }
  }

  mResetAll(ctx) {
    this.mResetCsi(ctx)
  }

  async mEscape(/**@type Context */ ctx) {
    const type = ctx.currentLine[0]
    switch (type) {
      case 'N':
      case 'O':
      case 'P':
      case '\\':
      case ']':
      case 'X':
      case '^':
      case '_':
      case 'N':
        ctx.currentLine = ctx.currentLine.slice(1)
        return
      case 'c':
        ctx.currentLine = ctx.currentLine.slice(1)
        await this.mResetAll(ctx)
        return
      case '[':
        ctx.currentLine = ctx.currentLine.slice(1)
        await this.mCsi(ctx)
        return
      default:
        return
    }
  }

  mResetCsi(/**@type Context */ ctx) {
    ctx.styles.clear()
  }

  mCsiClear(/**@type Context */ ctx, /**@type string */ group) {
    ctx.styles.delete(group)
  }

  mCsiSet(/**@type Context */ ctx, csiCmd, /**@type string */ group) {
    ctx.styles.add(group)
    ctx[group] = `csi-${csiCmd}`
  }

  mCsiSgr(/**@type Context */ ctx, sgrType) {
    switch (sgrType) {
      case 0:
        this.mResetCsi(ctx)
        return
      case 1:
      case 2:
        this.mCsiSet(ctx, sgrType, 'font-weight')
        return
      case 3:
        this.mCsiSet(ctx, sgrType, 'font-style')
        return
      case 5:
      case 6:
        this.mChangeCaretState(ctx, true)
        return
      case 25:
        this.mChangeCaretState(ctx, false)
        return
      case 30:
      case 31:
      case 32:
      case 33:
      case 34:
      case 35:
      case 36:
      case 37:
        this.mCsiSet(ctx, sgrType, 'color')
        return
      case 40:
      case 41:
      case 42:
      case 43:
      case 44:
      case 45:
      case 46:
      case 47:
        this.mCsiSet(ctx, sgrType, 'background')
        return
      default:
        return
    }
  }

  async mCsi(/**@type Context */ ctx) {
    const match = ctx.currentLine.match(/^([\d;]*)([ABCDEFGHJKSTZfminsu])/)
    if (!match) {
      return
    }
    const csiType = match[2]
    const args = match[1].split(';').map((arg) => parseInt(arg))
    ctx.currentLine = ctx.currentLine.slice(match[0].length)
    switch (csiType) {
      case 'm':
        this.mCsiSgr(ctx, args[0] || 0)
        return
      case 'C':
        if (args[0] > 0) {
          this.mChangeCaretPosition(ctx, -args[0])
        }
        return
      case 'Z':
        if (args[0] > 0) {
          await sleep(args[0])
        }
        return
      case 'J':
        this.mClearScreen(ctx, args[0] || 0)
        return
      default:
        return
    }
  }

  mPrintChar(/**@type Context */ ctx, c) {
    const e = document.createElement('code')
    e.innerText = c
    for (const style of ctx.styles) {
      ctx[style] && e.classList.add(ctx[style])
    }
    this.mScreen.insertBefore(e, this.mCaret)
    this.mRows[ctx.caretY] = [
      ...this.mRows[ctx.caretY].slice(0, ctx.caretX),
      e,
      ...this.mRows[ctx.caretY].slice(ctx.caretX),
    ]
    if (c === '\n') {
      ctx.caretY++
      ctx.caretX = 0
      this.mRows[ctx.caretY] = []
    } else {
      ctx.caretX++
    }
    this.mScreen.scrollTo({
      top: this.mScreen.scrollHeight - this.mScreen.clientHeight,
    })
  }

  async mPrintLine(/**@type Context */ ctx) {
    while (ctx.currentLine.length) {
      const prefix = this.mEscapePrefix.find((pre) =>
        ctx.currentLine.startsWith(pre)
      )
      if (prefix) {
        ctx.currentLine = ctx.currentLine.slice(prefix.length)
        await this.mEscape(ctx)
        continue
      }
      const c = ctx.currentLine[0]
      ctx.currentLine = ctx.currentLine.slice(1)
      this.mPrintChar(ctx, c)
      if (!ctx.currentLine.length) {
        return
      }
      if (ctx.enableCaret) {
        this.mInputCharDelay && (await sleep(this.mInputCharDelay))
      } else {
        this.mOutputCharDelay && (await sleep(this.mOutputCharDelay))
      }
    }
  }

  async replay(data) {
    const ctx = new Context()
    ctx.lines = data
    this.mScreen.innerHTML = ''
    this.mPrintCaret()
    this.mRows = [[]]
    for (const line of ctx.lines) {
      ctx.currentLine = line
      if (line.delay) {
        await sleep(line.delay)
        continue
      }
      await this.mPrintLine(ctx)
    }
  }
}
