class App {
  constructor() {
    /**@type { Object.<string,HTMLElement> } */
    this.components
    /**@type { Storage | {  } } */
    this.storage
    registerProperties(this, 'menus', 'content', 'showQrCode')
  }

  start() {
    /**@type { { toast:(msg:string, timeout:number = 1000)=>Promise<any> } } */
    this.modal_ = this.components.modal.model
    this.undoMenu_ = new MenuItem('撤销', this.undo_.bind(this), false)
    this.redoMenu_ = new MenuItem('重做', this.redo_.bind(this), false)
    this.menus = [
      new MenuItem('粘贴', this.paste_.bind(this), false),
      new MenuItem('复制', this.copy_.bind(this)),
      this.undoMenu_,
      this.redoMenu_,
      new MenuItem('二维码', this.showQrCode_.bind(this)),
      this.createCodeMenuItem('JSON转义', this.encodeJSON_),
    ]
    this.content = 'asfsdbfdjsbgkuidbgkdfgbki'
    this.maxContentsLength = 2
    this.undoContents_ = []
    this.redoContents_ = []
    /**@type boolean */
    this.showQrCode
  }

  changeContent(content) {
    this.content = content
  }

  showQrCode_() {
    if (!this.content) {
      return
    }
    this.showQrCode = true
  }

  paste_() {
    this.content = paste()
  }

  copy_() {
    copy(this.content)
    this.modal_.toast('复制成功')
  }

  undo_() {
    if (!this.undoContents_.length) {
      return
    }
    this.redoContents_.push(this.content)
    this.content = this.undoContents_.pop()
    this.redoMenu_.show = true
    if (!this.undoContents_.length) {
      this.undoMenu_.show = false
    }
  }

  redo_() {
    if (!this.redoContents_.length) {
      return
    }
    this.undoContents_.push(this.content)
    this.content = this.redoContents_.pop()
    this.undoMenu_.show = true
    if (!this.redoContents_.length) {
      this.redoMenu_.show = false
    }
  }

  createCodeMenuItem(
    /**@string name */ name,
    /**@type { (content:string)=>string } */ f
  ) {
    return new MenuItem(name, () => {
      this.undoContents_.push(this.content)
      if (this.undoContents_.length > this.maxContentsLength) {
        this.undoContents_.shift()
      }
      this.content = f(this.content)
      this.undoMenu_.show = true
      this.redoContents_ = []
      this.redoMenu_.show = false
    })
  }

  encodeJSON_(content) {
    return JSON.stringify(content)
  }

  decodeJson(content) {
    return JSON.parse(content).toString()
  }
}

import { copy } from '../commons/copy.js'
import { paste } from '../commons/paste.js'
