import { HTMLClockElement } from './clock.js'
import { Modal } from '../modal/index.js'
import { Tomato } from './tomato.js'
import { HTMLTagsElement } from './tags.js'

class TomatoEntity {
  constructor(
    /**@type number */ start,
    /**@type number */ end,
    /**@type string */ tag
  ) {
    this.start = start
    this.end = end
    this.tag = tag
  }
}

class App {
  view() {
    /**@type {  } */
    this.components
    return [
      ['clock', 'tags', 'tagsPopup', 'statistaicPanel', 'msg'],
      /**@imports css */ './app.css',
      /**@imports html */ './app.html',
      /**@imports html */ './statistic.html',
      /**@imports css */ './statistic.css',
    ]
  }

  async toogleClock_(/**@type MouseEvent */ ev) {
    ev.stopPropagation()
    if (this.currentTomato_.status === 'runing') {
      await this.currentTomato_.cancle()
      this.components.clock.setAttribute(HTMLClockElement.stateAttrName, false)
      if (this.currentTomato_.type === 'tomato') {
        this.currentTomato_ = new Tomato('none')
        return
      }
    }
    await this.loopTomatos()
  }

  async getTag(tag) {
    return new Promise((resolve) => {
      /**@type {{tagsPanel:HTMLElement}} */
      const { tagsPopup, tags } = this.components
      tagsPopup.onclick = (ev) => {
        ev.stopPropagation()
        tagsPopup.classList.add('hidden')
        tagsPopup.onclick = null
        resolve()
      }
      tags.onchange = () => {
        tagsPopup.classList.add('hidden')
        tagsPopup.onclick = null
        resolve(tags.getAttribute(HTMLTagsElement.valueAttrName))
      }
      tags.setAttribute(HTMLTagsElement.valueAttrName, tag)
      tagsPopup.classList.remove('hidden')
    })
  }

  async modifyTag() {
    const tag = await this.getTag(this.currentTag)
    if (tag === undefined) {
      return false
    }
    this.currentTag = tag
    return true
  }

  async loopTomatos() {
    while (true) {
      /**@type { Tomato } */
      const currentTomato = this.getNextTomato_(this.currentTomato_)
      this.currentTomato_ = currentTomato
      this.components.clock.setAttribute(HTMLClockElement.stateAttrName, true)
      await currentTomato.start(this.updateClockView_.bind(this))
      if (currentTomato.status !== 'finished') {
        break
      }
      if (this.currentTomato_ === currentTomato) {
        this.components.clock.setAttribute(
          HTMLClockElement.stateAttrName,
          false
        )
      }
      if (!(await this.modifyTag())) {
        currentTomato.finishTime = Date.now()
        break
      }
      currentTomato.finishTime = Date.now()
      this.addTomato_(
        new TomatoEntity(
          currentTomato.startTime,
          currentTomato.finishTime,
          this.currentTag
        )
      )
    }
  }

  updateClockView_() {
    const remainSeconds = this.currentTomato_.remain || 0
    const remainStr = `00:${Math.floor(remainSeconds / 60)
      .toString()
      .padStart(2, '0')}:${Math.floor(remainSeconds % 60)
      .toString()
      .padStart(2, '0')}`
    this.components.clock.setAttribute(HTMLClockElement.timeAttrName, remainStr)
    this.showMessage_(
      `${
        this.tomatoDisplayNames_.get(this.currentTomato_.type) || '番茄'
      } ${remainStr}`
    )
  }

  getNextTomato_(/**@type Tomato */ current) {
    const type = current.type === 'tomato' ? 'short-break' : 'tomato'
    const length = this.tomatoLengths_.get(type)
    return new Tomato(type, length)
  }

  getTomatos_() {
    const jsonStr = this.storage.getItem('tomatos')
    if (!jsonStr) {
      return []
    }
    try {
      return JSON.parse(jsonStr)
    } catch {
      return []
    }
  }

  addTomato_(/**@type TomatoEntity */ tomato) {
    this.tomatos_.push(tomato)
    if (this.tomatos_.length > this.maxTomatoLength) {
      this.tomatos_.shift()
    }
    this.storage.setItem('tomatos', JSON.stringify(this.tomatos_))
  }

  get currentTag() {
    return this.currentTag_
  }

  set currentTag(value) {
    this.currentTag_ = value
    this.components.root.style.backgroundColor = value
  }

  showMessage_(msg) {
    this.components.msg.innerText = msg || ''
  }

  pause() {
    if (this.currentTomato_.status !== 'runing') {
      return
    }
    this.currentTomato_.pause()
  }

  resume() {
    if (this.currentTomato_.status !== 'runing') {
      return
    }
    this.currentTomato_.resume()
  }

  start() {
    this.maxTomatoLength = 10000
    this.components.clock.onstateclick = this.toogleClock_.bind(this)
    /**@type TomatoEntity[] */
    this.tomatos_ = this.getTomatos_()
    this.tags_ = [
      '#cccc99c0',
      '#99cc66c0',
      '#ccccffc0',
      '#ffccccc0',
      '#ccccccc0',
      '#99ccccc0',
      '#ffffccc0',
      '#e9ae6ac0',
      '#cc9999c0',
    ]
    this.currentTag = this.tags_[0]
    this.components.tags.setAttribute(
      HTMLTagsElement.tagsAttrName,
      this.tags_.join(' ')
    )
    this.components.root.onclick = () => {
      this.components.statistaicPanel.classList.remove('open')
      this.modifyTag()
    }
    // this.components.statistaicPanel.onclick = (ev) => {
    //   ev.stopPropagation()
    //   this.components.statistaicPanel.classList.toggle('open')
    // }
    this.modal_ = new Modal()
    /**@type Map<TomatoType, string> */
    this.tomatoDisplayNames_ = new Map([
      ['tomato', '番茄'],
      ['short-break', '休息'],
      ['long-break', '休息'],
    ])
    /**@type Map<TomatoType, number> */
    this.tomatoLengths_ = new Map([
      ['tomato', 60 * 25],
      ['short-break', 60 * 5],
      ['long-break', 60 * 15],
    ])
    this.currentTomato_ = new Tomato('none')
    this.defaultMsg_ = '番茄 00:00:00'
    this.showMessage_(this.defaultMsg_)
  }
}
