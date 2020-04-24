import { Clock } from './clock.js'

class Product {
  constructor(
    desc,
    /**@type ProductLine*/ productLine,
    /**@type Factory */ factory
  ) {
    this.desc_ = desc
    this.productionLine_ = productLine
    this.factory_ = factory
  }

  get price() {
    return this.desc_.price
  }

  get type() {
    return this.desc_.type
  }
}

class ProductLineResource {
  constructor(type, cost) {
    this.type_ = type
    this.cost_ = cost
    this.current_ = 0
    this.progress_ = 0
  }

  increase(amount) {
    this.current_ += amount
    this.progress_ = this.current_ / this.cost_
    return this.current_ >= this.cost_
  }

  reset() {
    this.current_ = 0
  }

  get progress() {
    return this.progress_
  }

  get type() {
    return this.type_
  }
}

class ProductLine {
  constructor(desc, factory) {
    this.desc_ = desc
    this.factory_ = factory
    this.productDesc = desc.type
    this.resources_ = desc.costs.resources
      ? Array.from(
          desc.costs.resources,
          ({ type, amount }) => new ProductLineResource(type, amount)
        )
      : []
    this.resources_.unshift(new ProductLineResource(null, desc.costs.time))
  }

  get type() {
    return this.desc_.type
  }

  get progress() {
    return this.progress_
  }
  produce(
    /**@type number*/ time,
    /**@type { {get(type:any)=>number} } */ resources
  ) {
    this.resources_[0].increase(time)
    this.progress_ = this.resources_[0].progress
    for (let i = 1; i < this.resources_.length; i++) {
      const resource = this.resources_[i]
      resource.increase(resources.get(resource.type))
      if (resource.progress < this.progress_) {
        this.progress_ = resource.progress
      }
    }
    if (this.progress_ >= 1) {
      this.resources_.forEach((r) => r.reset())
      this.progress_ = 0
      return new Product(this.productDesc, this, this.factory_)
    }
    return null
  }
}

class Factory {
  constructor(desc) {
    this.desc_ = desc
    /**@type number */
    this.level_ = -1
    /**@type FactoryView */
    this.view_ = null
    this.range_ = this.desc_.range || 1
  }
  checkPlace(
    /**@type number */ x,
    /**@type number */ y,
    /**@type {(x:number, y:number)=>Cell} */ cellsProvider
  ) {
    this.x_ = x
    this.y_ = y
    /**@type Cell[] */
    const placeCells = []
    const canPlace = this.visitNeighbors_(this.range_, (i, j) => {
      const cell = cellsProvider(i, j)
      if (cell) {
        if (!cell.canPlace || cell.factory) {
          return true
        }
        placeCells.push(cell)
      }
    })
    return canPlace ? placeCells : null
  }

  placeWith(placeCells) {
    this.placeCells_ = placeCells
    this.placeCells_.forEach((cell) => (cell.factory = this))
  }

  get view() {
    return this.view_
  }
  set view(value) {
    if (this.view_) {
      this.view_.close()
    }
    this.view_ = value
    if (this.view_) {
      this.view_.changeLevel(this.desc_.levels[this.level_])
      this.view_.open()
    }
  }
  get level() {
    return this.level_
  }

  get maxLevel() {
    return this.desc_.levels.length
  }

  get upgradeCosts() {
    const nextLevel = this.level_ + 1
    return this.desc_.levels[nextLevel]
      ? this.desc_.levels[nextLevel].costs
      : '0'
  }

  destory() {
    for (const cell of this.resourceCells_) {
      cell.shareFactories.delete(this)
    }
    this.placeCells_.forEach((cell) => (cell.factory = null))
    this.view.close()
  }

  visitNeighbors_(range, checkTime) {
    for (let j = this.y_ - range + 1; j < this.y_ + range; j++) {
      for (let i = this.x_ - range + 1; i < this.x_ + range; i++) {
        if (checkTime(i, j)) {
          return false
        }
      }
    }
    return true
  }

  setLevel(level, /**@type {(x:number, y:number)=>Cell} */ cellsProvider) {
    const levelDesc = this.desc_.levels[level]
    if (!levelDesc) {
      return
    }
    this.resourceRange_ = levelDesc.resourceRange
    this.level_ = level
    /**@type ProductLine[] */
    this.productLines_ = levelDesc.products.map(
      (desc) => new ProductLine(desc, this)
    )
    /**@type Cell[] */
    this.resourceCells_ = []
    this.visitNeighbors_(this.resourceRange_, (i, j) => {
      const cell = cellsProvider(i, j)
      if (cell) {
        cell.shareFactories.add(this)
        this.resourceCells_.push(cell)
      }
    })
    this.view_ && this.view_.changeLevel(levelDesc)
  }

  produce(/**@type number */ time) {
    const products = []
    const progresses = []
    const incresedResource = new ResourceCollection()
    for (const cell of this.resourceCells_) {
      const cellResources = cell.getResources(time)
      incresedResource.increase(cellResources)
    }
    incresedResource.device(this.productLines_.length)
    for (const productLine of this.productLines_) {
      const product = productLine.produce(time, incresedResource)
      if (product) {
        products.push(product)
        this.view_.nodityProduct(product)
      }
      progresses.push({
        type: productLine.type,
        progress: productLine.progress,
      })
    }
    this.view_.updateprogress(progresses)
    return products
  }
}

class CellResource {
  constructor(desc, /**@type number */ speed) {
    this.desc_ = desc
    this.speed_ = speed
  }
  get type() {
    return this.desc_
  }
  get speed() {
    return this.speed_
  }
}

class Cell {
  constructor(x, y, desc) {
    this.desc_ = desc
    this.x_ = x
    this.y_ = y
    /**@type Factory */
    this.factory = null
    /**@type Set<Factory> */
    this.shareFactories = new Set()
    this.resources_ = desc.resources
      ? Array.from(
          desc.resources,
          ([desc, speed]) => new CellResource(desc, speed)
        )
      : []
  }

  /**@type boolean */
  get canPlace() {
    return this.desc_.canPlace
  }

  getResources(/**@type number */ time) {
    return new Map(
      this.resources_.map((r) => [
        r.type,
        (r.speed * time) / this.shareFactories.size,
      ])
    )
  }
}

class ResourceCollection {
  constructor() {
    /**@type Map<any, number> */
    this.resources_ = new Map()
  }

  increase(/**@type Map<any,number> */ res) {
    for (const [type, amount] of res) {
      if (!this.resources_.has(type)) {
        this.resources_.set(type, amount)
      } else {
        this.resources_.set(type, this.resources_.get(type) + amount)
      }
    }
  }

  device(/**@type number */ count) {
    for (const type of this.resources_.keys()) {
      this.resources_.set(type, this.resources_.get(type) / count)
    }
  }

  get(type) {
    return this.resources_.get(type) || 0
  }
}

class FactoryView {
  randomColor(colorPool) {
    return colorPool[Math.floor(Math.random() * colorPool.length)]
  }
  constructor(/**@type HTMLElement */ parent, px, py, range, cellSize) {
    this.cellSize_ = cellSize
    this.viewSize_ = ((range || 1) * 2 - 1) * this.cellSize_
    const randomColors = [
      '#ff0000',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#0000ff',
      '#ff00ff',
    ]
    this.parent_ = parent
    this.range_ = range
    this.view_ = document.createElement('div')
    this.view_.classList.add('factory')
    this.progressPanel_ = document.createElement('div')
    this.progressPanel_.classList.add('progress-panel')
    /**@type Map<any, HTMLElement> */
    this.progressViews_ = new Map()
    this.view_.appendChild(this.progressPanel_)
    this.view_.style.left = px - this.viewSize_ / 2
    this.view_.style.top = py - this.viewSize_ / 2
    this.view_.style.width = this.viewSize_
    this.view_.style.height = this.viewSize_
    this.shadowSize_ = 0
    this.color_ = this.randomColor(randomColors)
  }
  changeLevel(perfDesc) {
    // const shadowSize = Math.floor(this.cellSize_ * perfDesc.resourceRange)
    // if (this.shadowSize_ != shadowSize) {
    //   this.shadowSize_ = shadowSize
    //   this.view_.style.filter = `drop-shadow(0 0 ${Math.max(
    //     1,
    //     this.shadowSize_
    //   )}px ${this.color_})`
    // }
    if (this.backgroundClassName_) {
      this.view_.classList.remove(this.backgroundClassName_)
    }
    if (perfDesc.img && perfDesc.img.className) {
      this.backgroundClassName_ = perfDesc.img.className
      this.view_.classList.add(this.backgroundClassName_)
    } else {
      this.backgroundClassName_ = null
      this.view_.innerText = `${factoryDesc.type}`
    }
  }
  nodityProduct(/**@type Product */ product) {
    const productView = document.createElement('div')
    productView.classList.add('product')
    const price = document.createElement('div')
    price.innerText = `+ ${product.price}`
    productView.appendChild(price)
    this.view_.appendChild(productView)
    setTimeout(() => {
      productView.remove()
    }, 1500)
  }
  updateprogress(/**@type { {type:any, progress:number}[] } */ progresses) {
    /**@type Map<any, HTMLElement> */
    let toRemoveViews = new Set(this.progressViews_.keys())
    for (const { type, progress } of progresses) {
      let progressView
      if (!this.progressViews_.has(type)) {
        progressView = document.createElement('progress')
        progressView.max = 100
        this.progressPanel_.appendChild(progressView)
        this.progressViews_.set(type, progressView)
      } else {
        progressView = this.progressViews_.get(type)
        toRemoveViews.delete(type)
      }
      progressView.value = Math.min(Math.floor(progress * 100), 100)
    }
    for (const type of toRemoveViews) {
      const view = this.progressViews_.get(type)
      this.progressViews_.delete(type)
      view.remove()
    }
  }
  open() {
    this.parent_.appendChild(this.view_)
  }
  close() {
    this.view_.remove()
  }
}

export class Session {
  constructor(sessionData, components) {
    this.sessionData_ = sessionData
    this.components_ = components
    this.currency = sessionData.initCurrency
    this.completeCurrency_ = sessionData.completeCurrency
    this.components_.currency.max = this.completeCurrency_
    this.cellSize_ = sessionData.cellSize
    this.width_ = sessionData.size[0]
    this.height_ = sessionData.size[1]
    this.factoryNames_ = sessionData.factories.map((fac) => fac.type.type)
    /**@type Set<Factory> */
    this.factories_ = new Set()
    this.tps_ = 30
    this.tpf_ = 15
    this.spf_ = this.tpf_ / this.tps_
    this.clock_ = new Clock(this.tps_)
    this.factorisMenu_ = [
      {
        name: '升级',
        disable: (factory) => factory.level >= factory.maxLevel,
        onclick: (factory) => this.tryUpgradeFactory_(factory),
      },
      {
        name: '关闭',
        onclick: (factory) => this.deleteFactory_(factory),
      },
    ]
    /**@type { Cell[][] } */
    this.cells_ = Array.from({ length: this.height_ }, (_, y) =>
      Array.from(
        { length: this.width_ },
        (_, x) => new Cell(x, y, this.sessionData_.getCell(x, y))
      )
    )
  }

  upgradeFactory_(/**@type Factory */ factory) {
    if (factory.level >= factory.maxLevel) {
      console.log('Max Level')
      return false
    }
    if (this.currency < factory.upgradeCosts) {
      this.showMessage('资金不足')
      return false
    }
    this.currency -= factory.upgradeCosts
    factory.setLevel(factory.level + 1, this.getCellAt_.bind(this))
    return true
  }

  tryUpgradeFactory_(/**@type Factory */ factory) {
    if (this.upgradeFactory_(factory)) {
      this.showMessage(`升级到LEVEL ${factory.level}`)
    }
  }

  deleteFactory_(/**@type Factory */ factory) {
    factory.destory()
    this.factories_.delete(factory)
  }

  mapLocation_(px, py) {
    const { map } = this.components_
    const x = Math.floor((px + map.offsetLeft) / this.cellSize_)
    const y = Math.floor((py + map.offsetTop) / this.cellSize_)
    return [x, y]
  }

  screenLocation_(x, y) {
    const { map } = this.components_
    const px = x * this.cellSize_ - map.offsetLeft
    const py = y * this.cellSize_ - map.offsetTop
    return [px, py]
  }

  createSvgElement_(type) {
    return document.createElementNS('http://www.w3.org/2000/svg', type)
  }

  createTerrianView_(terrian, idx) {
    const clipPath = this.createSvgElement_('clipPath')
    const path = this.createSvgElement_('path')
    path.setAttribute('d', terrian.path)
    clipPath.appendChild(path)
    clipPath.id = `terrian_mask_${idx}`
    const terrianView = document.createElement('div')
    terrianView.style.clipPath = `url(#${clipPath.id})`
    if (terrian.type.style) {
      for (const prop in terrian.type.style) {
        if (prop.startsWith('background')) {
          terrianView.style[prop] = terrian.type.style[prop]
        }
      }
    }
    return [clipPath, terrianView]
  }

  showMessage(msg, timeout = 1000) {
    /**@type {{message:HTMLElement}} */
    const { message } = this.components_
    const token = Math.random().toString().slice(2, 18)
    this.currentMessageToken_ = token
    message.innerText = msg
    message.classList.remove('hidden')
    setTimeout(() => {
      if (token === this.currentMessageToken_) {
        message.classList.add('hidden')
      }
    }, timeout)
  }

  renderMap_(onclick) {
    const { map, terrians, svgDefs } = this.components_
    map.style.width = this.cellSize_ * this.width_
    map.style.height = this.cellSize_ * this.height_
    map.onclick = (/**@type MouseEvent */ ev) => {
      console.log(ev)
      const px = ev.pageX
      const py = ev.pageY
      console.log(ev)
      onclick(...this.mapLocation_(px, py))
    }
    for (let i = 0; i < this.sessionData_.terrians.length; i++) {
      const terrian = this.sessionData_.terrians[i]
      const [clipPath, terrianView] = this.createTerrianView_(terrian, i)
      svgDefs.appendChild(clipPath)
      terrians.appendChild(terrianView)
    }
  }

  createFactorySelectMenu(source, getText, onselect) {
    const list = document.createElement('div')
    list.classList.add('menu')
    for (const i of source) {
      const item = document.createElement('div')
      item.classList.add('menu-item')
      item.innerText = getText(i)
      item.onclick = () => onselect(i)
      list.appendChild(item)
    }
    return list
  }

  handleMapClick_(x, y) {
    /**@type {HTMLElement} */
    const popup = this.components_.popup
    let view
    const cell = this.cells_[y][x]
    const factory = cell.factory
    if (factory) {
      view = this.createFactorySelectMenu(
        this.factorisMenu_.filter((m) => !m.disable || !m.disable(factory)),
        (i) => i.name,
        (i) => {
          if (!i) {
            return
          }
          i.onclick(factory)
        }
      )
    } else if (cell.canPlace) {
      view = this.createFactorySelectMenu(
        this.sessionData_.factories,
        (i) => i.type.type,
        (i) => {
          if (!i || !i.type) {
            return
          }
          const factoryDesc = i.type
          const newFactory = new Factory(factoryDesc)
          const placeCells = newFactory.checkPlace(
            x,
            y,
            this.getCellAt_.bind(this)
          )
          if (!placeCells) {
            this.showMessage('不能建在这里！')
            return
          }
          if (!this.upgradeFactory_(newFactory)) {
            return
          }
          newFactory.placeWith(placeCells)
          const [px, py] = this.screenLocation_(x, y)
          const factoryView = new FactoryView(
            this.components_.units,
            px,
            py,
            factoryDesc.range,
            this.cellSize_
          )
          newFactory.view = factoryView
          this.factories_.add(newFactory)
          this.showMessage('创建成功！')
        }
      )
    }
    if (view) {
      popup.innerHTML = ''
      popup.appendChild(view)
      popup.classList.remove('hidden')
    }
  }

  getCellAt_(i, j) {
    if (i >= 0 && i < this.width_ && j >= 0 && j < this.height_) {
      return this.cells_[j][i]
    }
  }

  get currency() {
    return this.currency_
  }

  set currency(value) {
    this.currency_ = value
    this.components_.currency.value = value
  }

  async load() {
    this.components_.ui.classList.remove('hidden')
    this.components_.popup.onclick = () => {
      this.components_.popup.classList.add('hidden')
    }
    this.showMessage('开始！')
    this.components_.units.innerHTML = ''
    this.components_.terrians.innerHTML = ''
    this.components_.svgDefs.innerHTML = ''
    this.components_.sessionName.innerText = this.sessionData_.name
    for (const prop in this.sessionData_.style || []) {
      if (prop.startsWith('background')) {
        document.body.style[prop] = this.sessionData_.style[prop]
      }
    }
    this.renderMap_(this.handleMapClick_.bind(this))
    this.clock_.start()
    while (true) {
      await this.clock_.wait(this.tpf_)
      for (const factory of this.factories_) {
        const products = factory.produce(this.spf_)
        for (const product of products) {
          this.currency += product.price
          if (this.currency >= this.completeCurrency_) {
            this.components_.ui.classList.add('hidden')
            return true
          }
        }
      }
    }
  }
}
