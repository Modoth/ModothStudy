const evalInContext = (exp, context) => {
  return function () {
    with (this) {
      try {
        return eval(exp)
      } catch (e) {
        return
      }
    }
  }.call(context)
}

const bindingForInstruction = (/**@type HTMLElement */ element) => {
  let forExp = element.getAttribute('m-for')
  const match = forExp.match(
    /^\s*(((let|const|of)\s+)?(?<item>\w+)\s+(?<of_in>of|in)\s+)?\s*(?<data>\w+)\s*$/
  )
  if (!match || !match.groups || !match.groups.data) {
    throw new Error('Invalid m-for Expression')
  }
  const collectionName = match.groups.data
  const of_in = match.groups.of_in || 'of'
  let varName = match.groups.item
  let forHead
  if (varName) {
    forHead = `for(const ${varName} ${of_in} ${collectionName})`
  } else {
    varName = '$$i'
    forHead = `for(const ${varName} of ${collectionName})`
  }
  const comment = document.createComment(element.outerHTML)
  const parent = element.parentElement
  parent.insertBefore(comment, element)
  element.remove()
  /**@type Map<any, HTMLElement> */
  let items = new Map()
  /**@type Map<any, HTMLElement> */
  let newItems = new Map()
  let idx = 0
  let allRemoved = false
  const update = () => {
    ;(function ($$forEach) {
      if (!this[collectionName]) {
        return
      }

      newItems = new Map()
      idx = 0
      allRemoved = false
      with (this) {
        eval(`${forHead}{
        $$forEach(${varName})
        }`)
      }
      items = newItems
    }.call(element.context, ($$i) => {
      /**@type HTMLElement */
      let item
      if (items.has($$i)) {
        const pair = items.get($$i)
        item = pair.item
        if (!allRemoved && idx !== pair.idx) {
          console.log('removed')
          for (const [_, item] of items) {
            item.remove()
          }
          allRemoved = true
        }
        items.delete($$i)
      } else {
        item = element.cloneNode(true)
        item.removeAttribute('id')
        item.removeAttribute('m-for')
        item.model = $$i
        const context = Object.create(element.context)
        context[varName] = $$i
        item.context = context
      }
      parent.insertBefore(item, comment)
      newItems.set($$i, { idx, item })
      binding(item)
      idx++
    }))
  }

  update()
  return {
    update,
  }
}

const getPropNameFromBindingAttr = (attr) => {
  return attr.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

const bindingAttrs = (/**@type HTMLElement */ element) => {
  if (element.hasAttribute('m-for')) {
    return bindingForInstruction(element)
  }
  const bindingAttrs = element
    .getAttributeNames()
    .filter((p) => p.startsWith('m-'))
  const update = () => {
    for (const prop of bindingAttrs) {
      const $$exp = element.getAttribute(prop)
      const effectedAttr = prop
        .slice('m-'.length)
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a)
      let value
      if (effectedAttr.some((a) => a.startsWith('on'))) {
        value = `(function($event){with(this){${$$exp}}}).call(event.target.context, event)`
      } else {
        value = evalInContext($$exp, element.context)
      }
      for (const ea of effectedAttr) {
        if (ea === 'model') {
          if (element.setModelAndUpdate) {
            element.setModelAndUpdate(value)
          }
          continue
        }
        if (ea.startsWith('class-')) {
          const className = ea.slice('class-'.length)
          if (value) {
            element.classList.add(className)
          } else {
            element.classList.remove(className)
          }
          continue
        } else if (ea.startsWith('style-')) {
          const prop = getPropNameFromBindingAttr(ea.slice('style-'.length, -1))
          element.style[prop] = value
          continue
        }
        if (ea.endsWith('$')) {
          const prop = getPropNameFromBindingAttr(ea.slice(0, -1))
          element[prop] = value
          continue
        }
        if (value === undefined || value === null) {
          element.removeAttribute(ea)
        } else if (element[ea] !== value) {
          element.setAttribute(ea, value)
        }
      }
    }
  }
  update()
  element.update = update
  return element
}
const binding = (/**@type HTMLElement */ element) => {
  /**@type { Object.<string,HTMLElement> } */
  const components = element.context.components
  if (element.hasAttribute) {
    const handler = bindingAttrs(element)
    //collect ids
    if (element.hasAttribute('id')) {
      components[element.getAttribute('id')] = handler
    }
  }
  for (const child of [...element.children]) {
    if (
      child.context == element.context ||
      (child.context &&
        Object.getPrototypeOf(child.context) === element.context)
    ) {
    } else {
      child.context = element.context
    }
    binding(child)
  }
}

export function registerElement(tagName, /**@type {Function} */ constructor) {
  const elementClassName = `HTML${constructor.name}Element`
  eval(`
  class ${elementClassName} extends HTMLElement{
    constructor(){
      super()
      const shadow = this.attachShadow({mode:'open'})
      const template = document.getElementById('${tagName}')
      if(!template || template.tagName !== 'TEMPLATE' ){
        throw new Error('Define Template')
      }
      const instance = document.importNode(template.content, true)
      shadow.appendChild(instance)
      this.shadow_ = shadow
      this.codeBehind_ = new ${constructor.name}()
      this.codeBehind_.components = { }
      if(this.context && this.hasAttribute('m-model')){
        const modeExp = this.getAttribute('m-model')
        this.model = evalInContext(modeExp, this.context)
      }else{
        this.model =  {}
      }
    }

    get model(){
      return this.model_
    }

    set model(value){
      //combine code behind with model
      this.model_ = Object.assign(this.codeBehind_, value)
      this.shadow_.context = this.model_ 
    }

    setModelAndUpdate(value){
      this.model = value
      binding(this.shadow_)
    }
    
    connectedCallback(){
      binding(this.shadow_)
    }
  }
  customElements.define('${tagName}', ${elementClassName})
  `)
}

export class AppBase {
  async launch(data) {
    this.storage = this.initStorage_()
    this.data = await this.initData(data)
    await this.start()
  }

  initStorage_() {
    if (window.$storage) {
      return window.$storage
    }
    try {
      const s = window.localStorage
      return s
    } catch {
      return {
        getItem: () => '',
        setItem: () => true,
      }
    }
  }

  async initData(data) {
    return data
  }

  get view() {
    return 'app works'
  }

  async start() {
    console.log('start')
  }

  async pause() {
    console.log('pause')
  }

  async resume() {
    console.log('pause')
  }

  async stop() {
    console.log('stop')
  }
}
