export class AppBase {
  async init(/**@type HTMLElement */ root, data) {
    this.root = root
    this.data = await this.validateData(data)
    await this.initComponents(this.root)
    await this.start(this.data)
  }

  async validateData(data) {
    return data
  }

  async initComponents() {}

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
