export class AppBase {
  async launch() {
    this.storage = this.initStorage_()
    this.data = await this.initData(window.appData)
    window.app = this
    await this.start()
  }

  registerStorageProperties(...props) {
    if (!this.storage) {
      return
    }
    props.forEach((prop) => {
      let propValue = (() => {
        const jsonStr = this.storage.getItem(prop)
        if (!jsonStr) {
          return
        }
        try {
          return JSON.parse(jsonStr)
        } catch {}
      })()
      Object.defineProperty(this, prop, {
        get() {
          return propValue
        },
        set(newValue) {
          propValue = newValue
          this.storage.setItem(prop, JSON.stringify(propValue))
        },
      })
    })
  }

  initStorage_() {
    if (window.$storage) {
      return window.$storage
    }
    try {
      const s = window.localStorage
      return s
    } catch {
      return {
        getItem: () => '',
        setItem: () => true,
      }
    }
  }

  async initData(data) {
    return data
  }

  async start() {
    console.log('start')
  }

  async pause() {
    console.log('pause')
  }

  async resume() {
    console.log('pause')
  }

  async stop() {
    console.log('stop')
  }
}
