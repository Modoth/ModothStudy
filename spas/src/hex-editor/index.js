class App {
  constructor() {
    registerProperties(this, 'menus')
  }
  initData() { }
  start() {
    /**@type { Object.<string,HTMLElement> } */
    this.components
    this.menus = [
      new MenuItem("打开", this.openFile_.bind(this))
    ]
  }
  openFile_() {

  }
}

class MenuItem {
  constructor(name = '', show = true, onclick = null) {
    this.name = name
    this.show = show
    this.onclick = onclick
  }
}
