class App {
  constructor() {
    /**@type { Object.<string,HTMLElement> } */
    this.components
    /**@type { Storage } */
    this.storage
    registerProperties(
      this,
      'currentYear',
      'currentMonth',
      'days',
      'selectingColor'
    )
  }
  initData(data) {
    if (!data) {
      return
    }
    this.months_ = data.months
    this.colors = data.colors
  }
  async start() {
    this.selectColor = this.selectColor.bind(this)
    this.selectColorForDay = this.selectColorForDay.bind(this)
    await this.registerStorageProperties(['dayColors', {}])
    /**@type { { toast:(msg:string, timeout:number = 1000)=>Promise<any> } } */
    this.modal_ = this.components.modal.model
    const now = new Date()
    this.msPerDay_ = 1000 * 60 * 60 * 24
    this.setCurrent_(now)
  }

  setCurrent_(/**@type Date */ datetime) {
    const year = datetime.getFullYear()
    const month = datetime.getMonth()
    this.current_ = new Date(year, month)
    datetime = new Date(this.current_)
    this.currentMonth = this.months_[month]
    this.currentYear = year
    const padStart = datetime.getDay() - 1
    datetime.setMonth(month + 1)
    datetime.setDate(0)
    const dateCount = datetime.getDate()
    const padEnd =
      Math.ceil((dateCount + padStart) / 7) * 7 - (dateCount + padStart)
    this.days = [
      ...Array.from({ length: padStart }, () => new Day()),
      ...Array.from({ length: dateCount }, (_, i) => {
        const date = new Date(year, month, i + 1)
        return new Day(date, this.getDayColors(date))
      }),
      ...Array.from({ length: padEnd }, () => new Day()),
    ]
  }

  getDayColors(/**@type Date */ date) {
    return getBitFlags(this.dayColors[this.getDayKey_(date)]).map(
      (i) => this.colors[i]
    )
  }

  getDayKey_(date) {
    return Math.floor(date / this.msPerDay_)
  }

  selectColor(/**@type string */ color) {
    if (this.selectedDay_ && color) {
      const key = this.getDayKey_(this.selectedDay_.date)
      if (color && color !== 'transparent') {
        this.selectedDay_.colors = [color]
        this.dayColors[key] = this.selectedDay_.colors
          .map((c) => this.colors.indexOf(c))
          .filter((c) => c >= 0)
          .reduce((res, i) => res + (1 << i), 0)
          .toString(2)
      } else {
        this.selectedDay_.colors = []
        delete this.dayColors[key]
      }
      this.dayColors = Object.assign({}, this.dayColors)
    }
    this.selectedDay_ = null
    this.selectingColor = false
  }

  selectColorForDay(/**@type Day */ day) {
    if (!day.date) {
      return
    }
    this.selectingColor = true
    this.selectedDay_ = day
  }

  goMonth(i) {
    this.setCurrent_(
      new Date(this.current_.getFullYear(), this.current_.getMonth() + i)
    )
  }

  goPreMonth() {
    this.goMonth(-1)
  }
  goNextMonth() {
    this.goMonth(1)
  }
}

class Day {
  constructor(
    /**@type Date*/ date = undefined,
    /**@type {[string]} */ colors = []
  ) {
    registerProperties(this, 'colors')
    this.disable = date === undefined
    this.date = date
    this.name = this.disable ? '' : this.date.getDate().toString()
    this.colors = colors
  }
}

import { getBitFlags } from '../commons/get-bit-flags.js'
