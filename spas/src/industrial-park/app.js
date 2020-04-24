import { Session } from './session.js'

class App {
  view() {
    return [
      [
        'ui',
        'message',
        'popup',
        'currency',
        'map',
        'terrians',
        'units',
        'svg-defs',
        'styles',
        'session-name',
      ],
      .../**@imports html */ './map.html',
      .../**@imports html */ './ui.html',
      /**@imports css */ './map.css',
      /**@imports css */ './ui.css',
    ]
  }

  validateData(data) {
    if (!data) {
      data = /**@imports json */ './app-data.json'
    }
    let structureData = {}
    for (const defName of [
      'resources',
      'products',
      'factories',
      'terrians',
      'styles',
    ]) {
      structureData[defName] =
        data[defName] && new Map(data[defName].map((i) => [i.type, i]))
    }
    const linkRef = (obj, prop) => {
      if (obj[prop] && obj[prop].length) {
        const pool = structureData[prop]
        for (const v of obj[prop]) {
          v.type = pool.get(v.type)
        }
      }
    }
    for (const [_, factory] of structureData.factories) {
      for (const level of factory.levels) {
        linkRef(level, 'resources')
        linkRef(level, 'products')
        if (level.style) {
          level.style = structureData['styles'].get(level.style.type)
        }
        for (const product of level.products) {
          linkRef(product.costs, 'resources')
        }
      }
    }
    for (const [_, terrian] of structureData.terrians) {
      linkRef(terrian, 'resources')
    }
    structureData.sessions = data.sessions
    const getResourceIds = (i) => {
      if (!i) {
        return []
      }
      const s = i.toString(2)
      return Array.from(s, (v, i) => v === '1' && s.length - i - 1).filter(
        (i) => i !== false
      )
    }
    for (const session of structureData.sessions) {
      linkRef(session, 'terrians')
      linkRef(session, 'factories')
      const [width, height] = session.size
      const cells = Array.from({ length: height }, (_, y) =>
        Array.from({ length: width }, (_, x) => ({
          x,
          y,
          resources: new Map(),
        }))
      )
      session.getCell = (x, y) => {
        return cells[y][x]
      }
      session.loopCells = (callback) => {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            if (callback(cells[y][x])) {
              return
            }
          }
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width * session.cellSize
      canvas.height = height * session.cellSize
      const ctx = canvas.getContext('2d')
      for (let i = 0; i < session.terrians.length; i++) {
        const terrian = session.terrians[i]
        ctx.fillStyle = `rgb(${(i + 1.5) * 10},0,0)`
        ctx.strokeStyle = 'transparent'
        ctx.fill(new Path2D(terrian.path))
      }
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const cell = cells[y][x]
          const idx =
            (x * session.cellSize + y * session.cellSize * canvas.width) * 4
          const terrian = session.terrians[Math.floor(imgData[idx] / 10) - 1]
          if (terrian) {
            cell.canPlace = !!terrian.type.canPlace
            cell.resources = new Map(
              terrian.type.resources.map((r) => [r.type, r.speed])
            )
          }
        }
      }
    }
    return structureData
  }

  async start() {
    const styleStrs = []
    const styles = Array.from(this.data.styles.values())
    for (let i = 0; i < styles.length; i++) {
      const style = styles[i]
      style.className = `style-${i}`
      styleStrs.push(
        `.${style.className}{ ${style.rules
          .map(([prop, value]) => `${prop}: ${value};`)
          .join('\n')} }`
      )
    }
    this.components.styles.innerHTML = styleStrs.join('\n')
    while (true) {
      for (const session of this.data.sessions) {
        this.session_ = new Session(session, this.components)
        while (!(await this.session_.load())) {}
      }
    }
  }
}
