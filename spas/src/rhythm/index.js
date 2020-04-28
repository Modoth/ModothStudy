import { Clock } from '../commons/clock.js'
import { AppBase } from '../app-template/app-base.js'

class Beat {
  constructor() {
    this.enable = false
    this.current = false
  }
}

class Instrument {
  static get colors() {
    return [
      'hotpink',
      'lightgoldenrodyellow',
      'lightblue',
      'lightsalmon',
      'lightskyblue',
      'lightsteelblue',
    ]
  }
  constructor({ name = '', icon = '', audio = '' } = {}, onBeatChange) {
    this.name = name
    this.icon = icon
    this.audio = audio
    /**@type Beat[] */
    this.beats = []
    this.beatCount_ = 0
    this.onBeatChange_ = onBeatChange
    /**@type Beat */
    this.current = null
    this.color =
      Instrument.colors[Math.floor(Math.random() * Instrument.colors.length)]
    this.toogleBeat = (/**@type Beat */ beat) => {
      beat.enable = !beat.enable
      this.onBeatChange_ && this.onBeatChange_()
    }
    this.audioElement = document.createElement('audio')
    this.audioElement.src = this.audio
    this.audioElement.type = 'audio/mpeg'
  }

  setCurrent(idx = -1) {
    if (this.current) {
      this.current.current = false
      this.audioElement.pause()
    }
    this.current = this.beats[idx]
    if (this.current) {
      this.current.current = true
      if (this.audio && this.current.enable) {
        this.audioElement.currentTime = 0
        this.audioElement.play()
      }
    }
  }

  get beatCount() {
    return this.beatCount_
  }

  set beatCount(value) {
    let addLength = value - this.beatCount_
    if (addLength < 0) {
      this.beats = this.beats.slice(0, value)
    } else if (addLength > 0) {
      this.beats.push(...Array.from({ length: addLength }, () => new Beat()))
    }
  }
}

class App extends AppBase {
  initData(data) {
    data = data || /**@imports json */ './app-data.json'

    /**@type { Instrument[] } */
    this.instruments = data.instruments.map(
      (desc) => new Instrument(desc, this.handleBeatChange_.bind(this))
    )
    this.timeSignature_ = [4, 4]
    this.bpm_ = 120
    this.changeBeatsCount_(16)
  }

  async play() {
    if (this.isPlaying) {
      this.isPlaying = false
      this.components.btnPlay.update()
      return
    }
    this.isPlaying = true
    this.components.btnPlay.update()
    const clock = new Clock((this.bpm_ * this.timeSignature_[1]) / 60)
    let current = 0
    clock.start()
    while (this.isPlaying) {
      for (const instrument of this.instruments) {
        instrument.setCurrent(current)
      }
      this.components.instruments.update()
      await clock.wait(1)
      current = (current + 1) % this.beatsCount
    }
    clock.stop()
    for (const instrument of this.instruments) {
      instrument.setCurrent()
    }
    this.components.instruments.update()
  }

  handleBeatChange_() {
    this.components.instruments.update()
  }

  changeBeatsCount_(length) {
    this.beatsCount = length
    for (const instrument of this.instruments) {
      instrument.beatCount = this.beatsCount
    }
  }

  async start() {
    this.components.instruments.update()
  }
}
registerElement('m-app', App)
