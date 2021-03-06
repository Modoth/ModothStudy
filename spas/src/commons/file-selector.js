import { readFile } from './readFile.js'

export class FileSelector {
  constructor(/**@type HTMLElement */ root = document.body) {
    if (!window.$localStorage) {
      this.btnFile_ = document.createElement('input')
      this.btnFile_.style.display = 'none'
      this.btnFile_.type = 'file'
      root.appendChild(this.btnFile_)
    }
  }

  selectFile(
    mimeType = '*',
    /**@type { 'ArrayBuffer' | 'DataURL' | 'Text' } */ format = 'ArrayBuffer',
    /**@type { { (result :{file:File, data: ArrayBuffer | String }):any} } */
    callback
  ) {
    if (this.btnFile_) {
      this.btnFile_.accept = mimeType
      this.btnFile_.onchange = async () => {
        this.btnFile_.onchange = null
        const file = this.btnFile_.files[0]
        if (!file) {
          return
        }
        const data = await readFile(file, format)
        callback({ file, data })
      }
      this.btnFile_.click()
      return
    }
    window.$localStorage.openFile(mimeType, format).then((res) => {
      callback(res)
    })
  }
}
