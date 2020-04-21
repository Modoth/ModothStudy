import { Tree, Node, NodeSource } from './node.js'
import { Modal } from '../modal/index.js'
import { sleep } from '../commons/sleep.js'

export class Basket {
  constructor(/**@type Tree*/ tree) {
    this.tree_ = tree
    /**@type Map<string, NodeSource> */
    this.identifyNodes_ = new Map()
    /**@type Map<string, function(Node):any> */
    this.properGetters_ = new Map()
    this.preProcessNodes_(tree.root)
    /**@type Node */
    this.current_
    this.modal_ = new Modal()
    /**@type Node */
    this.updatingNode_
  }

  proxyObject_(obj, onDirect) {
    const props = Object.keys(obj)
    for (const prop of props) {
      const value = obj[prop]
      if (typeof value === 'string' && ~value.indexOf('${')) {
        Object.defineProperty(obj, prop, {
          get: () => {
            const getter = this.nodePropGetter_(value)
            if (this.updatingNode_) {
              return getter(this.updatingNode_)
            }
            throw 'Set updatingNode_ before get value'
          },
        })
      } else {
        onDirect && onDirect(value, prop)
      }
    }
  }

  preProcessNodes_(/**@type NodeSource */ node) {
    node.id && this.identifyNodes_.set(node.id, node)
    node.options &&
      this.proxyObject_(node.options, (value, _) =>
        this.preProcessNodes_(value)
      )
    node.results && this.proxyObject_(node.results)
    this.proxyObject_(node)
  }

  current() {
    return this.current_
  }

  split_(str, reg, onMatch) {
    const expSlices = []
    let curIdx = 0
    for (const { '0': expOuter, '1': exp, index } of str.matchAll(reg)) {
      index && expSlices.push(str.slice(curIdx, index))
      expSlices.push(onMatch(exp))
      curIdx = index + expOuter.length
    }
    if (curIdx < str.length) {
      expSlices.push(str.slice(curIdx))
    }
    return expSlices
  }

  evaluateExp_(exp) {
    const expSlices = this.split_(exp, /\$((-?\d+)|(\w+))/g, (m) => {
      const idx = parseInt(m)
      return {
        exec: (values, results) => {
          if (isNaN(idx)) {
            return results[m]
          }
          const n = idx > 0 ? values[idx + 1] : values[values.length - 1 + idx]
          return n
        },
      }
    })
    return (values, results) => {
      const ex = expSlices
        .map((s) => (s.exec ? s.exec(values, results) : s))
        .join('')
      try {
        return eval(ex)
      } catch {
        return `[ERROR(${exp})]`
      }
    }
  }

  /**@returns {function(NodeSource):any} */
  nodePropGetter_(/**@type string */ propValue) {
    if (!this.properGetters_.has(propValue)) {
      const ids = {}
      let idCount = 0
      propValue = this.split_(propValue, /(\$\{#.+\})/g, (m) => {
        const varName = `$id${idCount}`
        ids[varName] = m
        idCount++
        return varName
      }).join('')

      const expSlices = this.split_(propValue, /\$\{(.*?)\}/g, (m) => {
        if (
          /^([-\$0-9~!$%^&*()_+=|:",<.>/?]|(Math\.[a-z0-9]*)|(\$(\w)+))+$/.test(
            m
          )
        ) {
          return { exec: this.evaluateExp_(m) }
        } else {
          return `[ERROR(${m})]`
        }
      })

      this.properGetters_.set(propValue, (node) => {
        const values = [...node.selecteds.map((n) => n.value), node.value]
        const results = Object.create(
          node.selecteds[node.selecteds.length - 1].results
        )
        idCount && Object.assign(results, ids)
        const resSlices = expSlices.map((s) =>
          s.exec ? s.exec(values, results) : s
        )
        const expRes = resSlices.length == 1 ? resSlices[0] : resSlices.join('')
        if (!idCount) {
          return expRes
        }
        return this.identifyNodes_.get(expRes)
      })
    }

    return this.properGetters_.get(propValue)
  }

  async updateNode_(/**@type Node */ node) {
    const last = this.updatingNode_
    this.updatingNode_ = node
    const { selecteds, source } = node

    //update value firstly
    node.value = source.value
    node.valueType = source.valueType

    const results = Object.create(
      (node.selecteds[node.selecteds.length - 1] &&
        node.selecteds[node.selecteds.length - 1].results) ||
        null
    )
    if (source.results && source.results) {
      const variableNames = Object.keys(source.results)
      for (const variableName of variableNames) {
        results[variableName] = source.results[variableName]
      }
    }

    node.results = results

    node.question = source.question

    const sourceOptions = source.options
    const optNames = sourceOptions ? Object.keys(sourceOptions) : []
    if (!optNames.length) {
      this.updatingNode_ = last
      return node
    }
    const optSelecteds = [...selecteds, node]
    node.options = []
    for (const optName of optNames) {
      var opt = new Node()
      opt.name = optName
      opt.selecteds = optSelecteds
      opt.source = sourceOptions[optName]
      if (!opt.source) {
        continue
      }
      node.options.push(opt)
    }
    this.updatingNode_ = last
    return node
  }

  async select(/**@type Node */ node) {
    if (!node && !this.current_) {
      const root = new Node()
      root.selecteds = []
      root.source = this.tree_.root
      this.current_ = await this.updateNode_(root)
      return
    }
    if (!this.current_) {
      throw 'Client Error'
    }
    const optIdx = this.current_.options
      ? this.current_.options.findIndex((b) => b == node)
      : -1
    if (~optIdx) {
      this.current_ = await this.updateNode_(node)
      return
    }
    const selectedIdx = this.current_.selecteds.findIndex((r) => r == node)
    if (~selectedIdx) {
      this.current_ = node
      return
    }
    throw 'Client Error'
  }
}

export class App {
  constructor(window, appData) {
    this.window_ = window
    this.appData_ = appData
    this.rootElement_ = document.getElementById('app')
    this.styleTheme_ = document.getElementById('styleTheme')
    let theme = this.appData_.configs && this.appData_.configs.theme
    if (theme) {
      this.styleTheme_.innerText = ` :root {
        --background: ${theme.bg};
        --background-question:  ${theme.questionBg};
        --color-question:  ${theme.questionFg};
        --background-option:  ${theme.optionBg};
        --color-option:  ${theme.optionFg};
        --background-value:  ${theme.valueBg};
        --color-value:  ${theme.valueFg};
        --background-code:  ${theme.codeBg};
        --color-code:  ${theme.codeFg};
      }`
    }
    /**@type Map<String, Map<Node, HTMLElement>> */
    this.elements_ = new Map()
    /**@type Map<HTMLElement, {node:Node, type:string}> */
    this.lastElements_ = new Map()
    /**@type Map<HTMLElement, {node:Node, type:string}> */
    this.currentElements_ = new Map()
  }

  async launch() {
    const basket = new Basket(this.appData_)
    let current
    while (true) {
      await basket.select(current)
      current = await this.select_(basket.current())
    }
  }

  async clearUnusedElement_() {
    const removingTasks = []
    for (const [e, { node, type }] of this.lastElements_) {
      e.classList.add('removing')
      this.elements_.get(type).delete(node)
      removingTasks.push(
        new Promise((resolve) => {
          setTimeout(() => {
            this.rootElement_.removeChild(e)
            resolve()
          }, 500)
        })
      )
    }
    this.lastElements_ = this.currentElements_
    this.currentElements_ = new Map()
    await Promise.all(removingTasks)
  }

  insertElement_(
    node,
    /**@type string */ propType,
    value,
    classNames = '',
    onclick = null,
    valueType = null
  ) {
    if (!this.elements_.has(propType)) {
      this.elements_.set(propType, new Map())
    }
    const elements = this.elements_.get(propType)
    if (!elements.has(node)) {
      let e
      switch (valueType) {
        case 'code':
          e = document.createElement('div')
          const p = document.createElement('pre')
          e.appendChild(p)
          break
        case 'image':
          e = document.createElement('div')
          const i = document.createElement('div')
          e.appendChild(i)
          break
        default:
          e = document.createElement('div')
      }
      e.classList.add(propType)
      elements.set(node, e)
      this.rootElement_.appendChild(e)
    }
    const e = elements.get(node)
    if (this.lastElements_.has(e)) {
      this.lastElements_.delete(e)
    }
    this.currentElements_.set(e, { node, type: propType })
    switch (valueType) {
      case 'code':
        e.firstElementChild.innerText = value
        break
      case 'image':
        e.firstElementChild.style.backgroundImage = `url("${value}")`
        break
      default:
        e.innerText = value
    }
    e.className = [classNames, propType].join(' ')
    e.onclick = () => onclick(e)
    return e
  }

  async select_(/**@type Node */ node) {
    return new Promise((resolve) => {
      let uiTask
      const tryResolve = (res) => {
        uiTask || resolve(res)
      }
      let centerEle
      const { options } = node
      for (let i = 0; i <= node.selecteds.length; i++) {
        const questionNode = node.selecteds[i - 1]
        const optionNode = node.selecteds[i] || node
        questionNode &&
          questionNode.question &&
          this.insertElement_(
            questionNode,
            'question',
            questionNode.question,
            'selected',
            () => tryResolve(questionNode)
          )
        optionNode.name &&
          this.insertElement_(
            optionNode,
            'option',
            optionNode.name,
            'selected',
            () => tryResolve(questionNode)
          )
      }

      const hasOptions = node.options && node.options.length
      if (hasOptions) {
        centerEle =
          node.question &&
          this.insertElement_(node, 'question', node.question, 'current')
      } else {
        this.insertElement_(
          node,
          'value',
          node.value || '',
          'current',
          (ele) => {
            let selection = window.getSelection()
            selection.removeAllRanges()
            let range = document.createRange()
            range.selectNode(ele)
            selection.addRange(range)
            if (document.execCommand('copy')) {
              new Modal().toast('复制成功')
            }
            selection.removeAllRanges()
          },
          node.valueType
        )
      }

      hasOptions &&
        options.forEach((b) => {
          this.insertElement_(b, 'option', b.name, 'current', () =>
            tryResolve(b)
          )
        })
      uiTask = this.clearUnusedElement_()
      if (centerEle) {
        this.rootElement_.scrollTop = centerEle.offsetTop - 6
      }
      uiTask.then(() => {
        uiTask = null
      })
    })
  }
}
