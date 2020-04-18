export const AppState = {
  Stop: 0,
  Run: 1,
  Pause: 2,
}

export class AppBase {
  async launch(/**@type HTMLElement */ root, data) {
    this.root = root
    this.data = await this.validateData(data)
    await this.initComponents(this.root)
    this.result = 0
    this.state = AppState.Run
    await this.start(this.data)
    return this.result
  }

  async validateData(data) {
    return data
  }

  async start() {}

  async initComponents() {}

  sendPause() {
    this.state = AppState.Pause
  }

  sendResume() {
    this.state = AppState.Run
  }

  sendExit() {
    this.state = AppState.Stop
  }
}
