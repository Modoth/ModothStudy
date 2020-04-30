export class AppBase {
  async launch() {
    window.app = this
    this.storage = this.initStorage_()
    this.data = await this.initData(window.appData)
    await this.start()
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
