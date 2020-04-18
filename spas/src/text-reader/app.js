import { Modal } from '../modal/index.js'
import { readFile } from '../commons/readFile.js'
import { TextRender } from './text-render.js'
import { ResizeWatcher } from '../commons/resize-watcher.js'

export class App {
  constructor(window) {
    this.mWindow = window
    try {
      this.mStorage = window.$localStorage || window.localStorage
    } catch {
      this.mStorage = {
        getItem: () => '',
        setItem: () => true,
      }
    }
  }
  async launch() {
    this.mRoot = document.getElementById('app')
    document.addEventListener('keydown', (ev) => this.mHandlerKeys(ev))
    this.mLogoContainer = document.getElementById('logoContainer')
    this.mTryOpenFile = async () => {
      if (this.mIsLoadingFile) {
        return
      }
      if (window.$localStorage) {
        const res = await window.$localStorage.openFile('text/plain', 'Text')
        if (res) {
          await this.mLoadFile(res.file, res.data)
        }
      } else {
        this.mInputFile.click()
      }
    }
    this.mKeyBindings = {
      'C-O': this.mTryOpenFile,
      'C-R': () => window.location.reload(),
      ARROWRIGHT: () => this.mPageDown(),
      ARROWLEFT: () => this.mPageUp(),
    }
    new ResizeWatcher(window).register(
      () => this.mFileContent && this.mReload()
    )
    this.mReaderContainer = document.getElementById('readerContainer')
    this.mReaderContainer.onclick = (ev) => this.mHandleClicks(ev)
    this.mTextRender = new TextRender(this.mReaderContainer)
    this.mInputFile = document.getElementById('inputFile')
    this.mLogoContainer.addEventListener('click', this.mTryOpenFile)
    this.mInputFile.addEventListener('change', () => {
      if (this.mInputFile.files && this.mInputFile.files[0]) {
        this.mLoadFile(this.mInputFile.files[0])
      }
    })
    this.mClickResions = [
      '11066666044',
      '11066666044',
      '11000000022',
      '11003330022',
      '11003330022',
      '11003330022',
      '11000000022',
      '22222222255',
      '22222222255',
    ]
    this.mThemes = [
      {
        fontSize: 18,
        color: 'darkslateblue',
        hightcolor: 'red',
        fontFamily: 'serif',
        background: '#f6f6e2',
      },
      {
        fontSize: 18,
        color: '#eee',
        hightcolor: 'red',
        fontFamily: 'serif',
        background: '#333',
      },
    ]
    this.mClickResionsHeight = this.mClickResions.length
    this.mClickResionsWidth = this.mClickResions[0].length
    /**@type Map<number,number> */
    this.mPages = new Map()
    this.mModal = new Modal()
  }

  mHandleClicks({ x, y }) {
    const px = Math.floor(
      (x * this.mClickResionsWidth) / this.mReaderContainer.clientWidth
    )
    const py = Math.floor(
      (y * this.mClickResionsHeight) / this.mReaderContainer.clientHeight
    )
    let type = this.mClickResions[py][px] >>> 0
    switch (type) {
      case 1:
        this.mPageUp()
        break
      case 2:
        this.mPageDown()
        break
      case 3:
        this.mTryOpenFile()
        break
      case 4:
        this.mChangeFullscreen()
        break
      case 5:
        this.mChangeTheme()
        break
      case 6:
        this.mGoto()
        break
    }
  }

  async mGoto() {
    let res = await this.mModal.prompt(
      '转到',
      Math.floor((this.mCurrentOffset * 100) / this.mFileContent.length),
      {
        type: 'range',
        max: 100,
        min: 0,
      }
    )
    if (!res) {
      return
    }
    this.mCurrentOffset = Math.floor(
      (this.mFileContent.length * (res >>> 0)) / 100
    )
    await this.mReload()
  }

  mChangeFullscreen() {
    this.mRoot.requestFullscreen()
  }

  mHandlerKeys(/**@type KeyboardEvent */ ev) {
    let keyStr = `${ev.ctrlKey ? 'C-' : ''}${ev.shiftKey ? 'S-' : ''}${
      ev.altKey ? 'A-' : ''
    }${ev.key.toUpperCase()}`
    if (this.mKeyBindings[keyStr]) {
      ev.stopPropagation()
      ev.preventDefault()
      this.mKeyBindings[keyStr]()
    }
  }

  async mPageUp() {
    await this.mLoadPage(this.mCurrentPageIdx - 1)
  }

  async mPageDown() {
    await this.mLoadPage(this.mCurrentPageIdx + 1)
  }

  async mPaging() {
    if (this.mReloadCancleSource) {
      this.mReloadCancleSource.cancled = true
    }
    const cancleSource = {}
    this.mReloadCancleSource = cancleSource
    let firstPage = 0
    const onpage = (page, offset, nextOffset) => {
      if (page < firstPage) {
        firstPage = page
      }
      this.mPages.set(page, { offset, nextOffset })
    }
    let start = Date.now()
    await this.mTextRender.page(
      this.mFileContent,
      this.mZeroPageOffset,
      onpage,
      {
        fontSize: this.mFontSize,
      },
      cancleSource
    )
    if (cancleSource.cancled) {
      return
    }
    if (this.mZeroPageOffset > 0) {
      let newOffsets = new Map()
      for (const [page, offset] of this.mPages) {
        newOffsets.set(page - firstPage, offset)
      }
      this.mCurrentPageIdx -= firstPage
      this.mPages = newOffsets
      this.mZeroPageOffset = 0
    }
    console.log(`Page Finished: ${(Date.now() - start) / 1000}s`)
  }

  async mLoadPage(pageIdx) {
    if (pageIdx < 0) {
      return
    }
    if (this.mPages.has(pageIdx)) {
      this.mCurrentPageIdx = pageIdx
      const page = this.mPages.get(this.mCurrentPageIdx)
      this.mCurrentOffset = page.offset
      const nextOffset =
        page.offset +
        this.mTextRender.rend(this.mFileContent, page.offset, page.nextOffset)
      this.mStorage.setItem(`${this.mFileName}_offset`, this.mCurrentOffset)
      if (
        this.mPages.has(this.mCurrentPageIdx + 1) &&
        this.mPages.get(this.mCurrentPageIdx + 1).offset !== nextOffset &&
        nextOffset != this.mFileContent.length
      ) {
        this.mPaging()
        console.log(page, nextOffset)
      }
    }
  }

  async mChangeTheme() {
    let idx = this.mThemes.findIndex((t) => t === this.mCurrentTheme)
    idx = (idx + 1) % this.mThemes.length
    this.mCurrentTheme = this.mThemes[idx]
    this.mFileContent && (await this.mReload())
    this.mRoot.style.background = this.mCurrentTheme.background
  }

  async mReload() {
    this.mPages = new Map()
    this.mZeroPageOffset = this.mCurrentOffset
    this.mPages.set(0, { offset: this.mCurrentOffset })
    this.mTextRender.setStyle(this.mCurrentTheme)
    this.mPaging()
    await this.mLoadPage(0)
  }

  async mLoadFile(/**@type File*/ file, content) {
    if (!this.mThemeInited) {
      this.mChangeTheme()
      this.mThemeInited = true
    }
    this.mIsLoadingFile = true
    this.mLogoContainer.classList.add('hidden')
    this.mReaderContainer.classList.remove('hidden')
    this.mFileName = file.name
    this.mFileContent = content || (await readFile(file))
    const offset = await this.mStorage.getItem(`${this.mFileName}_offset`)
    this.mCurrentOffset = Math.min(
      parseInt(offset) || 0,
      this.mFileContent.length
    )
    await this.mReload()
    this.mIsLoadingFile = false
  }
}
