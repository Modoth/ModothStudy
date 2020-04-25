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
      ['clock', 'tags', 'tagsPopup'],
      /**@imports css */ './app.css',
      /**@imports html */ './app.html',
      /**@imports html */ './statistic.html',
      /**@imports css */ './statistic.css',
    ]
  }

  async toogleClock_() {
    if (
      this.currentTomato_.status === 'runing' &&
      !(await this.modal_.confirm(
        `取消${this.tomatoDisplayNames_.get(this.currentTomato_.type)}`
      ))
    ) {
      return
    }
    await this.currentTomato_.cancle()
    await this.loopTomatos()
  }

  async getTag(currentTag) {
    return new Promise((resolve) => {
      /**@type {{tagsPanel:HTMLElement}} */
      const { tagsPopup, tags } = this.components
      tagsPopup.onclick = () => {
        tagsPopup.classList.add('hidden')
        tagsPopup.onclick = null
        resolve()
      }
      tags.onchange = () => {
        tagsPopup.classList.add('hidden')
        tagsPopup.onclick = null
        resolve(tags.getAttribute(HTMLTagsElement.valueAttrName))
      }
      tags.setAttribute(HTMLTagsElement.valueAttrName, currentTag)
      tagsPopup.classList.remove('hidden')
    })
  }

  async loopTomatos() {
    while (true) {
      /**@type { Tomato } */
      const currentTomato = this.getNextTomato_(this.currentTomato_)
      this.currentTomato_ = currentTomato
      await currentTomato.start(this.updateClockView_.bind(this))
      if (currentTomato.status !== 'finished') {
        break
      }
      if (currentTomato.type === 'tomato') {
        const tag = await this.getTag(this.currentTag_)
        if (tag === undefined) {
          break
        }
        this.currentTag_ = tag
        this.addTomato_(
          new TomatoEntity(
            currentTomato.startTime,
            currentTomato.finishTime,
            this.currentTag_
          )
        )
      } else {
        if (!(await this.modal_.confirm('开始'))) {
          break
        }
      }
    }
  }

  updateClockView_() {
    const remainSeconds = this.currentTomato_.remain
    this.components.clock.setAttribute(
      HTMLClockElement.timeAttrName,
      `0:${Math.floor(remainSeconds / 60)}:${Math.floor(remainSeconds % 60)}`
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

  start() {
    this.maxTomatoLength = 10000
    this.components.clock.addEventListener(
      'click',
      this.toogleClock_.bind(this)
    )
    /**@type TomatoEntity[] */
    this.tomatos_ = this.getTomatos_()
    this.currentTag_ = '未分类'
    this.tags_ = [this.currentTag_, 'A', 'B', 'C', 'D']
    this.components.tags.setAttribute(
      HTMLTagsElement.tagsAttrName,
      this.tags_.join(' ')
    )
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
  }
}
