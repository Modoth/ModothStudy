class App {
  constructor() {
    registerProperties(this, 'title', 'isPlaying', 'instruments')
  }
  initData(data) {
    /**@type { Instrument[] } */
    this.instruments = data.instruments.map(
      (desc) => new Instrument(desc)
    )
    this.timeSignature_ = [4, 4]
    this.bpm_ = data.bpm || 30
    this.title = data.title || '节奏器'
    this.changeBeatsCount_(16)
  }

  async tooglePlay() {
    if (this.audioContext_ === undefined) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        /**@type { AudioContext } */
        this.audioContext_ = new AudioContext()
        for (const instrument of this.instruments) {
          await instrument.bindAudioContext(this.audioContext_)
        }
      } else {
        this.audioContext_ = null
      }
    }
    if (this.isPlaying) {
      this.isPlaying = false
      return
    }
    this.isPlaying = true
    const clock = new Clock(this.bpm_ / 60)
    let current = 0
    clock.start()
    while (this.isPlaying) {
      for (const instrument of this.instruments) {
        instrument.setCurrent(current)
      }
      await clock.wait(1)
      current = (current + 1) % this.beatsCount
    }
    clock.stop()
    for (const instrument of this.instruments) {
      instrument.setCurrent()
    }
  }

  changeBeatsCount_(length) {
    this.beatsCount = length
    for (const instrument of this.instruments) {
      instrument.beatCount = this.beatsCount
    }
  }

  async start() {

  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false
    }
  }
}

class Beat {
  constructor() {
    registerProperties(this, 'enable', 'current')
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
  constructor({ name = '', icon = '', audio = '' } = {}) {
    this.name = name
    this.icon = icon
    this.audio = audio
    /**@type Beat[] */
    this.beats = []
    this.beatCount_ = 0
    /**@type Beat */
    this.current = null
    this.color =
      Instrument.colors[Math.floor(Math.random() * Instrument.colors.length)]
    this.toogleBeat = (/**@type Beat */ beat) => {
      beat.enable = !beat.enable
    }
    this.audioElement = document.createElement('audio')
    this.audioElement.src = this.audio
    this.audioElement.type = 'audio/mpeg'
    /**@type { AudioContext} */
    this.audioContext_ = null
    /**@type { AudioBufferSourceNode } */
    this.audioSource_ = null
  }

  async bindAudioContext(context) {
    this.audioContext_ = context
    if (this.audioContext_ && this.audio) {
      this.audioSource_ = this.audioContext_.createBufferSource()
      this.audioSource_.buffer = await this.audioContext_.decodeAudioData(
        await (await fetch(this.audio)).arrayBuffer()
      )
    }
  }

  setCurrent(idx = -1) {
    if (this.current) {
      this.current.current = false
      if (this.audio && this.current.enable) {
        if (this.audioSource_) {
          console.log('stop')
          this.audioSource_.disconnect()
        } else {
          this.audioElement.pause()
        }
      }
    }
    this.current = this.beats[idx]
    if (this.current) {
      this.current.current = true
      if (this.audio && this.current.enable) {
        if (this.audioSource_) {
          const source = this.audioContext_.createBufferSource()
          source.buffer = this.audioSource_.buffer
          this.audioSource_ = source
          this.audioSource_.connect(this.audioContext_.destination)
          this.audioSource_.start(0, 0)
          console.log('start')
        } else {
          this.audioElement.currentTime = 0
          this.audioElement.play()
        }
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

import { Clock } from '../commons/clock.js'
