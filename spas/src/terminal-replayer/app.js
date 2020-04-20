import { TerminalReplayer } from './terminal-replayer.js'
import { highlight } from './highlight.js'

class App {
  initComponents() {
    const style = /**@imports css */ './app.css'
    this.mReplay = document.createElement('div')
    this.mReplay.classList.add('replay')
    this.mReplay.innerText = 'REPLAY'
    this.mReplayer = new TerminalReplayer()
    this.mReplayer.view.classList.add('terminal-replayer')
    this.root.appendChild(this.mReplayer.view)
    this.root.appendChild(this.mReplay)
    this.root.appendChild(style)
    this.mReplay.onclick = () => !this.isReplay && this.play()
    this.mTestData = /**@imports txt */ './test-data.txt'
  }

  async start(data) {
    this.mHighlightedData = [highlight(data || this.mTestData)]
    const option = { inputCharDelay: 1, outputCharDelay: 0 }
    await this.play(option)
  }

  async play(option) {
    if (this.isReplay) {
      return
    }
    this.isReplay = true
    this.mReplay.classList.add('playing')
    this.mReplay.innerText = 'PLAY...'
    await this.mReplayer.replay(this.mHighlightedData, option)
    this.mReplay.classList.remove('playing')
    this.mReplay.innerText = 'REPLAY'
    this.isReplay = false
  }
}
