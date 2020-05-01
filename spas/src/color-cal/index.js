const getDayNum = (date) => {
  return Math.floor(date / (1000 * 60 * 60 * 24))
}

const todayNum = getDayNum(Date.now())

class App {
  async start() {
    this.selectColor = this.selectColor.bind(this)
    this.selectColorForDay = this.selectColorForDay.bind(this)
    await this.registerStorageProperties(['dayColors', {}, () => this.resume()])
    await this.resume()
  }

  async resume() {
    this.setCurrentMonth_(new Date())
  }

  setCurrentMonth_(/**@type Date */ date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    this.current_ = new Date(year, month)
    date = new Date(this.current_)
    this.currentYear = year
    this.currentMonth = this.months_[month]
    const padStart = date.getDay() - 1
    date.setMonth(month + 1)
    date.setDate(0)
    const dayCount = date.getDate()
    const totalDisplayWeeks = 6
    const padEnd = totalDisplayWeeks * 7 - (dayCount + padStart)
    this.days = [
      ...Array.from(
        { length: padStart },
        (_, i) => new Day(new Date(year, month, i - padStart + 1))
      ),
      ...Array.from({ length: dayCount }, (_, i) => {
        const day = new Date(year, month, i + 1)
        return new Day(day, this.getDayColors_(day), true)
      }),
      ...Array.from(
        { length: padEnd },
        (_, i) => new Day(new Date(year, month + 1, i + 1))
      ),
    ]
    this.selectedDay = this.days[0]
  }

  getDayColors_(/**@type Date */ day) {
    return getBitFlags(this.dayColors[getDayNum(day)]).map(
      (i) => this.colors[i]
    )
  }

  selectColor(/**@type string */ color) {
    if (this.selectingDay_ && color) {
      const key = getDayNum(this.selectingDay_.date)
      if (color && color !== 'transparent') {
        this.selectingDay_.colors = [color]
        this.dayColors[key] = this.selectingDay_.colors
          .map((c) => this.colors.indexOf(c))
          .filter((c) => c >= 0)
          .reduce((res, i) => res + (1 << i), 0)
          .toString(2)
      } else {
        this.selectingDay_.colors = []
        delete this.dayColors[key]
      }
      this.dayColors = Object.assign({}, this.dayColors)
      this.selectedDay = this.selectingDay_
    }
    this.selectingDay_ = null
    this.selectingColor = false
  }

  selectColorForDay(/**@type Day */ day) {
    if (!day.date) {
      return
    }
    this.selectingColor = true
    this.selectingDay_ = day
  }

  goMonth(i) {
    this.setCurrentMonth_(
      new Date(this.current_.getFullYear(), this.current_.getMonth() + i)
    )
  }

  goPreMonth() {
    this.goMonth(-1)
  }

  goNextMonth() {
    this.goMonth(1)
  }

  constructor() {
    /**@type { Object.<string,HTMLElement> } */
    this.components
    registerProperties(
      this,
      'currentYear',
      'currentMonth',
      'days',
      'dayNames',
      'selectingColor',
      'selectedDay'
    )
  }
  initData(data) {
    if (!data) {
      return
    }
    this.months_ = data.months
    this.dayNames = data.dayNames
    this.colors = data.colors
  }
}

class Day {
  constructor(
    /**@type Date*/ date = undefined,
    /**@type {[string]} */ colors = [],
    current = false
  ) {
    registerProperties(this, 'colors')
    this.disable = date === undefined
    this.date = date
    this.name = this.disable ? '' : this.date.getDate().toString()
    this.colors = colors
    this.current = current
    this.today = todayNum === getDayNum(this.date)
  }
}

import { getBitFlags } from '../commons/get-bit-flags.js'
