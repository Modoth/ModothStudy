export class AppBase {
  async launch() {
    this.storage = this.initStorage_()
    this.data = await this.initData(window.appData)
    window.app = this
    await this.start()
  }

  async registerStorageProperties(...props) {
    if (!this.storage) {
      return
    }
    for (const [prop, defaultValue] of props) {
      let propValue = await (async () => {
        const jsonStr = await this.storage.getItem(prop)
        if (!jsonStr) {
          return defaultValue
        }
        try {
          return JSON.parse(jsonStr)
        } catch {
          return defaultValue
        }
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
    }
  }

  initStorage_() {
    if (window.$localStorage) {
      return window.$localStorage
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
