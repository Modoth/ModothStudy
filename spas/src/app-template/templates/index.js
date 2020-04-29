class App {
  constructor() {
    /**@type { Object.<string,HTMLElement> } */
    this.components
    /**@type { Storage } */
    this.storage
    registerProperties(this, 'title', 'isPlaying', 'instruments')
  }
  initData() {}
  start() {
    this.title = 'hello'
  }
}
