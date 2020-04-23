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
        'imgStyles',
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
      'images',
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
        if (level.img) {
          level.img = structureData['images'].get(level.img.type)
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
      for (const terrian of session.terrians) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const cell = cells[y][x]
            const resourceId = parseInt(terrian.resources[y][x]) || 0
            const ids = getResourceIds(resourceId)
            if (ids.length) {
              cell.canPlace = cell.canPlace || !!terrian.type.canPlace
            }
            for (const id of ids) {
              const res = terrian.type.resources[id]
              if (!cell.resources.has(res.type)) {
                cell.resources.set(res.type, res.speed)
              } else {
                cell.resources.set(
                  res.type,
                  cell.resources.get(res.type) + res.speed
                )
              }
            }
          }
        }
      }
    }
    return structureData
  }

  async start() {
    const imageStyles = []
    const images = Array.from(this.data.images.values())
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      img.className = `img-${i}`
      imageStyles.push(
        `.${img.className}{ background-image: url("${img.url}") }`
      )
    }
    this.components.imgStyles.innerHTML = imageStyles.join('\n')
    while (true) {
      for (const session of this.data.sessions) {
        this.session_ = new Session(session, this.components)
        while (!(await this.session_.load())) {}
      }
    }
  }
}
