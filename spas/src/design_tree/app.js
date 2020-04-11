import { Tree, Node, NodeSource } from './node.js'
import { Modal } from '../modal/index.js'
import { sleep } from '../commons/sleep.js'

export class Basket {
  constructor(/**@type Tree*/ tree) {
    this.mTree = tree
    /**@type Map<string, NodeSource> */
    this.mIdentifyNodes = new Map()
    /**@type Map<string, function(Node):any> */
    this.mProperGetters = new Map()
    this.mPreProcessNodes(tree.root)
    /**@type Node */
    this.mCurrent
    this.mModal = new Modal()
    /**@type Node */
    this.mUpdatingNode
  }

  mProxyObject(obj, onDirect) {
    const props = Object.keys(obj)
    for (const prop of props) {
      const value = obj[prop]
      if (typeof value === 'string' && ~value.indexOf('${')) {
        Object.defineProperty(obj, prop, {
          get: () => {
            const getter = this.mNodePropGetter(value)
            if (this.mUpdatingNode) {
              return getter(this.mUpdatingNode)
            }
            throw 'Set mUpdatingNode before get value'
          },
        })
      } else {
        onDirect && onDirect(value, prop)
      }
    }
  }

  mPreProcessNodes(/**@type NodeSource */ node) {
    node.id && this.mIdentifyNodes.set(node.id, node)
    node.options &&
      this.mProxyObject(node.options, (value, _) =>
        this.mPreProcessNodes(value)
      )
    node.results && this.mProxyObject(node.results)
    this.mProxyObject(node)
  }

  current() {
    return this.mCurrent
  }

  mSplit(str, reg, onMatch) {
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

  mEvaluateExp(exp) {
    const expSlices = this.mSplit(exp, /\$((-?\d+)|(\w+))/g, (m) => {
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
  mNodePropGetter(/**@type string */ propValue) {
    if (!this.mProperGetters.has(propValue)) {
      const ids = {}
      let idCount = 0
      propValue = this.mSplit(propValue, /(\$\{#.+\})/g, (m) => {
        const varName = `$id${idCount}`
        ids[varName] = m
        idCount++
        return varName
      }).join('')

      const expSlices = this.mSplit(propValue, /\$\{(.*?)\}/g, (m) => {
        if (
          /^([-\$0-9~!$%^&*()_+=|:",<.>/?]|(Math\.[a-z0-9]*)|(\$(\w)+))+$/.test(
            m
          )
        ) {
          return { exec: this.mEvaluateExp(m) }
        } else {
          return `[ERROR(${m})]`
        }
      })

      this.mProperGetters.set(propValue, (node) => {
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
        return this.mIdentifyNodes.get(expRes)
      })
    }

    return this.mProperGetters.get(propValue)
  }

  async mUpdateNode(/**@type Node */ node) {
    const last = this.mUpdatingNode
    this.mUpdatingNode = node
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
      this.mUpdatingNode = last
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
    this.mUpdatingNode = last
    return node
  }

  async select(/**@type Node */ node) {
    if (!node && !this.mCurrent) {
      const root = new Node()
      root.selecteds = []
      root.source = this.mTree.root
      this.mCurrent = await this.mUpdateNode(root)
      return
    }
    if (!this.mCurrent) {
      throw 'Client Error'
    }
    const optIdx = this.mCurrent.options
      ? this.mCurrent.options.findIndex((b) => b == node)
      : -1
    if (~optIdx) {
      this.mCurrent = await this.mUpdateNode(node)
      return
    }
    const selectedIdx = this.mCurrent.selecteds.findIndex((r) => r == node)
    if (~selectedIdx) {
      this.mCurrent = node
      return
    }
    throw 'Client Error'
  }
}

export class App {
  constructor(window, appData) {
    this.mWindow = window
    this.mAppData = appData
    this.mRootElement = document.getElementById('app')
    this.mStyleTheme = document.getElementById('styleTheme')
    let theme = this.mAppData.configs && this.mAppData.configs.theme
    if (theme) {
      this.mStyleTheme.innerText = ` :root {
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
    this.mElements = new Map()
    /**@type Map<HTMLElement, {node:Node, type:string}> */
    this.mLastElements = new Map()
    /**@type Map<HTMLElement, {node:Node, type:string}> */
    this.mCurrentElements = new Map()
  }

  async launch() {
    const basket = new Basket(this.mAppData)
    let current
    while (true) {
      await basket.select(current)
      current = await this.mSelect(basket.current())
    }
  }

  async mClearUnusedElement() {
    const removingTasks = []
    for (const [e, { node, type }] of this.mLastElements) {
      e.classList.add('removing')
      this.mElements.get(type).delete(node)
      removingTasks.push(
        new Promise((resolve) => {
          setTimeout(() => {
            this.mRootElement.removeChild(e)
            resolve()
          }, 500)
        })
      )
    }
    this.mLastElements = this.mCurrentElements
    this.mCurrentElements = new Map()
    await Promise.all(removingTasks)
  }

  mInsertElement(
    node,
    /**@type string */ propType,
    value,
    classNames = '',
    onclick = null,
    valueType = null
  ) {
    if (!this.mElements.has(propType)) {
      this.mElements.set(propType, new Map())
    }
    const elements = this.mElements.get(propType)
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
      this.mRootElement.appendChild(e)
    }
    const e = elements.get(node)
    if (this.mLastElements.has(e)) {
      this.mLastElements.delete(e)
    }
    this.mCurrentElements.set(e, { node, type: propType })
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

  async mSelect(/**@type Node */ node) {
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
          this.mInsertElement(
            questionNode,
            'question',
            questionNode.question,
            'selected',
            () => tryResolve(questionNode)
          )
        optionNode.name &&
          this.mInsertElement(
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
          this.mInsertElement(node, 'question', node.question, 'current')
      } else {
        centerEle = this.mInsertElement(
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
          this.mInsertElement(b, 'option', b.name, 'current', () =>
            tryResolve(b)
          )
        })
      uiTask = this.mClearUnusedElement()
      if (centerEle) {
        this.mRootElement.scrollTop = centerEle.offsetTop - 6
      }
      uiTask.then(() => {
        uiTask = null
      })
    })
  }
}
