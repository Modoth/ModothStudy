import { TerminalReplayer } from './terminal-replayer.js'
import { highlight } from './highlight.js'

class App {
  initComponents() {
    const style = /**@imports css */ './app.css'
    this.replay_ = document.createElement('div')
    this.replay_.classList.add('replay')
    this.replay_.innerText = 'REPLAY'
    this.replayer_ = new TerminalReplayer()
    this.replayer_.view.classList.add('terminal-replayer')
    this.root.appendChild(this.replayer_.view)
    this.root.appendChild(this.replay_)
    this.root.appendChild(style)
    this.replay_.onclick = () => !this.isReplay && this.play()
    this.testData_ = /**@imports txt */ './test-data.txt'
  }

  async start(data) {
    this.highlightedData_ = [highlight(data || this.testData_)]
    const option = { inputCharDelay: 1, outputCharDelay: 0 }
    await this.play(option)
  }

  async play(option) {
    if (this.isReplay) {
      return
    }
    this.isReplay = true
    this.replay_.classList.add('playing')
    this.replay_.innerText = 'PLAY...'
    await this.replayer_.replay(this.highlightedData_, option)
    this.replay_.classList.remove('playing')
    this.replay_.innerText = 'REPLAY'
    this.isReplay = false
  }
}
