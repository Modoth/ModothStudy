import { Clock } from '../commons/clock.js'
/**@typedef { 'none' | 'tomato' | 'short-break' | 'long-break' } TomatoType */
/**@typedef { 'none' | 'runing' | 'finished' | 'cancled' } TomatoStatus */

export class Tomato {
  constructor(/**@type TomatoType */ type, /**@type number */ length) {
    this.type_ = type
    /**@type TomatoStatus */
    this.status_ = 'none'
    this.startTime = 0
    this.finishTime = 0
    this.toFinishTime_ = Infinity
    this.remain_ = length
    this.clock_ = new Clock(1)
    this.canclingTask_ = null
  }

  async cancle() {
    if (this.status_ !== 'runing') {
      return
    }
    if (this.canclingTask_) {
      return this.canclingTask_
    }
    this.status_ = 'cancled'
    this.finishTime = Date.now()
  }

  async start(ontick) {
    this.clock_.start()
    this.status_ = 'runing'
    this.startTime = Date.now()
    const startTick = this.clock_.tick_
    const finishTick = startTick + this.remain_
    while (this.status_ === 'runing') {
      await this.clock_.wait(1)
      this.remain_ = Math.max(0, finishTick - this.clock_.tick_)
      if (this.remain_ === 0) {
        this.status_ = 'finished'
        this.finishTime = Date.now()
      }
      ontick && ontick()
    }
    this.clock_.stop()
  }

  get status() {
    return this.status_
  }

  get remain() {
    return this.remain_
  }

  get type() {
    return this.type_
  }
}
