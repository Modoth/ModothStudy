import { Modal } from '../modal/index.js'
import { copy } from '../commons/copy.js'

export class App {
  constructor(/**@type Window */ window) {
    this.window_ = window
    this.document_ = this.window_.document
    /**@type HTMLInputElement */
    this.txbFilter_ = this.window_.document.getElementById('txbFilter')
    this.table_ = this.window_.document.getElementById('table')
    this.styleFont_ = this.window_.document.getElementById('styleFont')
    this.txbFilter_.addEventListener('input', () => this.update())
    this.btnExport_ = this.window_.document.getElementById('btnExport')
    this.modal = new Modal()
    this.data_ = /**@imports json */ './app-data.json'

    this.cmdPrefix_ = '> '
    this.cmdObj_ = {
      new: {
        name: this.cmdPrefix_ + 'new',
        exec: async () => await this.generate(),
      },
      naming: {
        name: this.cmdPrefix_ + 'naming',
        needClick: true,
        exec: async (idx) => {
          let newData = this.cloneAppData(this.data_)
          await this.editNamesProp(newData, idx)
          return this.promptReload(newData)
        },
      },
      style: {
        name: this.cmdPrefix_ + 'style',
        exec: async () => {
          let style = await this.modal.prompt('样式:', this.data_.style)
          if (style === undefined || style === null) {
            return false
          }
          style = style.trim()
          let newData = this.cloneAppData(this.data_)
          newData.style = style || undefined
          return await this.promptReload(newData)
        },
      },
      value: {
        name: this.cmdPrefix_ + 'value',
        exec: async () => {
          let valueName = await this.modal.prompt(
            '值属性:',
            this.data_.valueName
          )
          if (valueName === undefined || valueName === null) {
            return false
          }
          valueName = valueName.trim()
          let newData = this.cloneAppData(this.data_)
          newData.valueName = valueName || undefined
          return await this.promptReload(newData)
        },
      },
      font: {
        name: this.cmdPrefix_ + 'font',
        exec: async () => {
          let fontUrl = await this.modal.prompt('字体URL:')
          debugger
          if (fontUrl === undefined || fontUrl === null) {
            return false
          }
          fontUrl = fontUrl.trim()
          let font
          if (fontUrl) {
            let fontFormat = await this.modal.prompt('字体格式:')
            if (fontFormat === undefined || fontFormat === null) {
              return false
            }
            fontFormat = fontFormat.trim() || undefined
            font = { url: fontUrl, format: fontFormat }
          } else {
            font = undefined
          }
          let newData = this.cloneAppData(this.data_)
          newData.font = font
          return await this.promptReload(newData)
        },
      },
      exportData: {
        name: this.cmdPrefix_ + 'export',
        exec: async () => {
          await this.promptReload(this.data_)
          return false
        },
      },
      styling: {
        name: this.cmdPrefix_ + 'styling',
        needClick: true,
        exec: async (idx) => {
          let newData = this.cloneAppData(this.data_)
          await this.editStyleProp(newData, idx)
          return this.promptReload(newData)
        },
      },
    }
    this.cmds_ = Object.values(this.cmdObj_)
  }

  async generate() {
    if (this.isGenerating) {
      return true
    }
    this.isGenerating = true
    let res = await this.generateInternal()
    this.isGenerating = false
    return res
  }

  async generateInternal() {
    let dataStr = await this.modal.prompt('查询列表(空白分割)或格式化数据:')
    dataStr = dataStr && dataStr.trim()
    if (!dataStr) {
      return false
    }
    let appData
    try {
      appData = JSON.parse(dataStr)
    } catch {
      //ignore
    }
    if (appData && appData.items && appData.items.length) {
      await this.load(appData)
      return true
    }
    let keys = [
      ...new Set(dataStr.split(' ').filter((s) => s != '' && s != ' ')),
    ]
    if (keys.length == 0) {
      return false
    }
    let items = keys.map((key) => ({ key }))
    if (
      !(await this.modal.confirm(
        `共计${keys.length}:${keys.slice(0, 3).join(', ')}${
          keys.length > 3 ? '...' : ''
        }`
      ))
    ) {
      return false
    }
    appData = { items }
    await this.editNamesProp(appData)
    return await this.promptReload(appData)
  }

  async editStyleProp(appData, startIdx = 0) {
    return await this.editProp(
      appData,
      'style',
      (item, prop) => {
        return item[prop] || ''
      },
      (item, propStr) => {
        item.style = propStr || undefined
        return true
      },
      startIdx
    )
  }

  async editNamesProp(appData, startIdx = 0) {
    return await this.editProp(
      appData,
      'names',
      (item, prop) => {
        return (item[prop] && item[prop].join(' ')) || ''
      },
      (item, propStr) => {
        let names = [
          ...new Set(propStr.split(' ').filter((s) => s != '' && s != ' ')),
        ]
        item.names = names.length == 0 ? undefined : names
        return true
      },
      startIdx
    )
  }

  async editProp(appData, prop, getProp, setProp, startIdx = 0) {
    let items = appData.items
    for (var i = startIdx; i < items.length; i++) {
      let item = items[i]
      if (!item) {
        throw 'Invalid Data'
      }
      let propStr = await this.modal.prompt(
        `【${item.key}】的${prop}属性:`,
        getProp(item, prop)
      )
      if (propStr === null || propStr === undefined) {
        return false
      }
      propStr = propStr && propStr.trim()
      if (!setProp(item, propStr)) {
        return false
      }
    }
    return true
  }

  async promptReload(data) {
    if (
      (await this.modal.prompt('加载？', JSON.stringify(data))) &&
      data != this.data_
    ) {
      await this.load(data)
      return true
    }
    return false
  }

  like(/**@type string*/ value, /**@type string*/ filter) {
    return value.indexOf(filter) >= 0
  }

  async sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  }

  async update() {
    let filter = this.txbFilter_.value || ''
    let cmd = this.cmds_.find((c) => c.name === filter)
    if (cmd) {
      if (cmd.needClick) {
        filter = ''
      } else {
        this.txbFilter_.value = ''
        this.filter_ = undefined
        if (await cmd.exec()) {
          return
        }
        filter = ''
      }
    }
    if (this.filter_ === filter) {
      return
    }
    this.filter_ = filter
    if (this.updateTask) {
      await this.updateTask
      this.updateTask = null
    }
    this.updateTask = this.updateInternal(filter)
    await this.updateTask
    this.updateTask = null
  }

  cloneAppData(data) {
    return {
      items: data.items && data.items.slice(),
      font: data.font && Object.assign({}, data.font),
      style: data.style,
    }
  }

  async updateInternal(filter) {
    this.table_.innerHTML = ''
    let taskCount = 100
    let taskDelay = 0
    let current = 0
    while (current < this.data_.items.length) {
      await this.sleep(taskDelay)
      if (this.filter_ !== filter) {
        return
      }
      let next = current + taskCount
      let items = filter
        ? this.data_.items
            .slice(current, next)
            .filter(
              (p) =>
                this.like(p.key, filter) ||
                (p.names && p.names.some((v) => this.like(v, filter)))
            )
        : this.data_.items.slice(current, next)
      current = next
      for (let item of items) {
        let div = document.createElement('div')
        let textSpan = document.createElement('span')
        if (item.style) {
          textSpan.style = item.style
          textSpan.classList.add('trans-text')
        }
        const useValueName = this.data_.valueName && item[this.data_.valueName]
        textSpan.innerText = useValueName
          ? item[this.data_.valueName]
          : item.key
        textSpan.onclick = async () => {
          let filter = this.txbFilter_.value || ''
          let cmd = this.cmds_.find((c) => c.name === filter)
          if (cmd && cmd.needClick) {
            let idx = this.data_.items.indexOf(item)
            if (idx >= 0) {
              await cmd.exec(idx)
            }
            return
          }
          if (item.style) {
            document.getElementById('styleBg').innerText = `
           #searchBar{
            background-size: 2em 2em;
            ${item.style}
           }
            `
          }
          if (copy(textSpan.innerText)) {
            this.modal.toast(
              `已复制:${item.key}` +
                (useValueName ? `的${this.data_.valueName}` : '')
            )
          }
        }
        div.appendChild(textSpan)
        this.table_.appendChild(div)
      }
    }
  }

  async load(data) {
    this.data_ = data
    this.txbFilter_.value = ''
    let style =
      data.font && data.font.url
        ? `@font-face {
            font-family: 'keys-font';
            src: url("${data.font.url}") format("${data.font.format}");
            font-weight: normal;
            font-style: normal;
        }
        `
        : ''
    style += data.style || ''
    this.styleFont_.innerText = style
    this.filter_ = undefined
    await this.update()
  }

  async start() {
    let data =
      this.window_.appData && this.window_.appData.items
        ? this.window_.appData
        : this.data_
    await this.load(data)
  }
}
