export class AppBase {
  async init(/**@type HTMLElement */ root, data) {
    this.root = root
    this.data = await this.validateData(data)
    await this.initComponents(this.root)
    this.components = { root }
    let elements = this.view(this.root)
    if (elements && elements) {
      let componentNames
      if (elements[0] instanceof Array) {
        componentNames = elements[0]
        elements = elements.slice(1)
      }
      for (const c of elements) {
        this.root.appendChild(c)
      }
      for (const n of componentNames) {
        this.components[this.getElementName(n)] = document.getElementById(n)
      }
    }
    await this.start(this.data)
  }

  getElementName(id) {
    return id.replace(/-(.)/g, (_, g) => g.toUpperCase())
  }

  async validateData(data) {
    return data
  }

  async initComponents() {}

  view() {}

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
