;(async (window) => {
  if (window.__m_style_viewer_instance) {
    return
  }
  // const { App } = await import('./app.js')
  const PropMetas = {
    'animation-delay': {},
    'animation-direction': {},
    'animation-duration': {},
    'animation-fill-mode': {},
    'animation-iteration-count': {},
    'animation-name': {},
    'animation-play-state': {},
    'animation-timing-function': {},
    'background-attachment': {},
    'background-blend-mode': {},
    'background-clip': {},
    'background-color': {},
    'background-image': {},
    'background-origin': {},
    'background-position': {},
    'background-repeat': {},
    'background-size': {},
    'border-bottom-color': {},
    'border-bottom-left-radius': {},
    'border-bottom-right-radius': {},
    'border-bottom-style': {},
    'border-bottom-width': {},
    'border-collapse': {},
    'border-image-outset': {},
    'border-image-repeat': {},
    'border-image-slice': {},
    'border-image-source': {},
    'border-image-width': {},
    'border-left-color': {},
    'border-left-style': {},
    'border-left-width': {},
    'border-right-color': {},
    'border-right-style': {},
    'border-right-width': {},
    'border-top-color': {},
    'border-top-left-radius': {},
    'border-top-right-radius': {},
    'border-top-style': {},
    'border-top-width': {},
    bottom: {},
    'box-shadow': {},
    'box-sizing': {},
    'break-after': {},
    'break-before': {},
    'break-inside': {},
    'caption-side': {},
    clear: {},
    clip: {},
    color: { inheritance: true },
    content: {},
    cursor: {},
    direction: {},
    display: {},
    'empty-cells': {},
    float: {},
    'font-family': {},
    'font-kerning': {},
    'font-optical-sizing': {},
    'font-size': {},
    'font-stretch': {},
    'font-style': {},
    'font-variant': {},
    'font-variant-ligatures': {},
    'font-variant-caps': {},
    'font-variant-numeric': {},
    'font-variant-east-asian': {},
    'font-weight': {},
    height: {},
    'image-rendering': {},
    isolation: {},
    'justify-items': {},
    'justify-self': {},
    left: {},
    'letter-spacing': {},
    'line-height': {},
    'list-style-image': {},
    'list-style-position': {},
    'list-style-type': {},
    'margin-bottom': {},
    'margin-left': {},
    'margin-right': {},
    'margin-top': {},
    'max-height': {},
    'max-width': {},
    'min-height': {},
    'min-width': {},
    'mix-blend-mode': {},
    'object-fit': {},
    'object-position': {},
    'offset-distance': {},
    'offset-path': {},
    'offset-rotate': {},
    opacity: {},
    orphans: {},
    'outline-color': {},
    'outline-offset': {},
    'outline-style': {},
    'outline-width': {},
    'overflow-anchor': {},
    'overflow-wrap': {},
    'overflow-x': {},
    'overflow-y': {},
    'padding-bottom': {},
    'padding-left': {},
    'padding-right': {},
    'padding-top': {},
    'pointer-events': {},
    position: {},
    resize: {},
    right: {},
    'scroll-behavior': {},
    speak: {},
    'table-layout': {},
    'tab-size': {},
    'text-align': {},
    'text-align-last': {},
    'text-decoration': {},
    'text-decoration-line': {},
    'text-decoration-style': {},
    'text-decoration-color': {},
    'text-decoration-skip-ink': {},
    'text-underline-position': {},
    'text-indent': {},
    'text-rendering': {},
    'text-shadow': {},
    'text-size-adjust': {},
    'text-overflow': {},
    'text-transform': {},
    top: {},
    'touch-action': {},
    'transition-delay': {},
    'transition-duration': {},
    'transition-property': {},
    'transition-timing-function': {},
    'unicode-bidi': {},
    'vertical-align': {},
    visibility: {},
    'white-space': {},
    widows: {},
    width: {},
    'will-change': {},
    'word-break': {},
    'word-spacing': {},
    'z-index': {},
    zoom: {},
    '-webkit-appearance': {},
    'backface-visibility': {},
    '-webkit-border-horizontal-spacing': {},
    '-webkit-border-image': {},
    '-webkit-border-vertical-spacing': {},
    '-webkit-box-align': {},
    '-webkit-box-decoration-break': {},
    '-webkit-box-direction': {},
    '-webkit-box-flex': {},
    '-webkit-box-ordinal-group': {},
    '-webkit-box-orient': {},
    '-webkit-box-pack': {},
    '-webkit-box-reflect': {},
    'column-count': {},
    'column-gap': {},
    'column-rule-color': {},
    'column-rule-style': {},
    'column-rule-width': {},
    'column-span': {},
    'column-width': {},
    'backdrop-filter': {},
    'align-content': {},
    'align-items': {},
    'align-self': {},
    'flex-basis': {},
    'flex-grow': {},
    'flex-shrink': {},
    'flex-direction': {},
    'flex-wrap': {},
    'justify-content': {},
    '-webkit-font-smoothing': {},
    'grid-auto-columns': {},
    'grid-auto-flow': {},
    'grid-auto-rows': {},
    'grid-column-end': {},
    'grid-column-start': {},
    'grid-template-areas': {},
    'grid-template-columns': {},
    'grid-template-rows': {},
    'grid-row-end': {},
    'grid-row-start': {},
    'row-gap': {},
    '-webkit-highlight': {},
    hyphens: {},
    '-webkit-hyphenate-character': {},
    '-webkit-line-break': {},
    '-webkit-line-clamp': {},
    '-webkit-locale': {},
    '-webkit-margin-before-collapse': {},
    '-webkit-margin-after-collapse': {},
    '-webkit-mask-box-image': {},
    '-webkit-mask-box-image-outset': {},
    '-webkit-mask-box-image-repeat': {},
    '-webkit-mask-box-image-slice': {},
    '-webkit-mask-box-image-source': {},
    '-webkit-mask-box-image-width': {},
    '-webkit-mask-clip': {},
    '-webkit-mask-composite': {},
    '-webkit-mask-image': {},
    '-webkit-mask-origin': {},
    '-webkit-mask-position': {},
    '-webkit-mask-repeat': {},
    '-webkit-mask-size': {},
    order: {},
    perspective: {},
    'perspective-origin': {},
    '-webkit-print-color-adjust': {},
    '-webkit-rtl-ordering': {},
    'shape-outside': {},
    'shape-image-threshold': {},
    'shape-margin': {},
    '-webkit-tap-highlight-color': {},
    '-webkit-text-combine': {},
    '-webkit-text-decorations-in-effect': {},
    '-webkit-text-emphasis-color': {},
    '-webkit-text-emphasis-position': {},
    '-webkit-text-emphasis-style': {},
    '-webkit-text-fill-color': {},
    '-webkit-text-orientation': {},
    '-webkit-text-security': {},
    '-webkit-text-stroke-color': {},
    '-webkit-text-stroke-width': {},
    transform: {},
    'transform-origin': {},
    'transform-style': {},
    '-webkit-user-drag': {},
    '-webkit-user-modify': {},
    'user-select': {},
    '-webkit-writing-mode': {},
    '-webkit-app-region': {},
    'buffered-rendering': {},
    'clip-path': {},
    'clip-rule': {},
    mask: {},
    filter: {},
    'flood-color': {},
    'flood-opacity': {},
    'lighting-color': {},
    'stop-color': {},
    'stop-opacity': {},
    'color-interpolation': {},
    'color-interpolation-filters': {},
    'color-rendering': {},
    fill: {},
    'fill-opacity': {},
    'fill-rule': {},
    'marker-end': {},
    'marker-mid': {},
    'marker-start': {},
    'mask-type': {},
    'shape-rendering': {},
    stroke: {},
    'stroke-dasharray': {},
    'stroke-dashoffset': {},
    'stroke-linecap': {},
    'stroke-linejoin': {},
    'stroke-miterlimit': {},
    'stroke-opacity': {},
    'stroke-width': {},
    'alignment-baseline': {},
    'baseline-shift': {},
    'dominant-baseline': {},
    'text-anchor': {},
    'writing-mode': {},
    'vector-effect': {},
    'paint-order': {},
    d: {},
    cx: {},
    cy: {},
    x: {},
    y: {},
    r: {},
    rx: {},
    ry: {},
    'caret-color': {},
    'line-break': {},
  }

  const createShadow = () => {
    const shadowElement = document.createElement('div')
    shadowElement.style.background = 'transparent'
    shadowElement.style.position = 'fixed'
    shadowElement.style.zIndex = 999
    const shadow = shadowElement.attachShadow({ mode: 'closed' })
    return { shadowElement, shadow }
  }

  const insertElements = (
    /**@type Map*/ inserteds,
    /**@type HTMLElement*/ ele
  ) => {
    if (ele.parentElement && !inserteds.has(ele.parentElement)) {
      insertElements(inserteds, ele.parentElement)
    }
    inserteds.set(ele, new Map())
  }

  const initStyles = (/**@type HTMLElement*/ eles) => {
    const inserteds = new Map()
    for (const ele of eles) {
      insertElements(inserteds, ele)
    }

    return inserteds
  }

  const selectorPririties = new Map()

  const getSelectPriority = (/**@type string */ selector) => {
    if (!selectorPririties.has(selector)) {
      selectorPririties.set(
        selector,
        ((s) => {
          if (~s.indexOf('#')) {
            return 2
          }
          if (~s.indexOf('.')) {
            return 1
          }
          const fixedSelector = s.replace(':not', '').replace('::', '')
          if (~fixedSelector.indexOf(':')) {
            return 1
          }
          return 0
        })(selector)
      )
    }
    return selectorPririties.get(selector)
  }

  const getAffectedStyles = (
    globalStyles,
    /**@type Map */ propMetas,
    elements
  ) => {
    const styleSheets = document.styleSheets
    /**@type Map<HTMLElement, Map<string, []> */
    const styles = initStyles(elements)

    for (const sheet of styleSheets) {
      /**@type CSSStyleRule*/
      let rule, rules
      try {
        rules = sheet.rules
      } catch {
        continue
      }
      for (rule of rules) {
        const f = (rule) => {
          if (!rule.selectorText) {
            if (rule.conditionText && window.matchMedia(rule.conditionText)) {
              for (const mediarule of rule.cssRules) {
                f(mediarule)
              }
            }
            return
          }

          const selectors = rule.selectorText
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== '')
          for (const selector of selectors) {
            const priority = getSelectPriority(selector)
            let targets
            try {
              targets = document.querySelectorAll(selector)
            } catch (e) {
              console.log(`unsupported selector: ${selector}`)
              continue
            }
            for (const element of targets) {
              if (styles.has(element)) {
                for (const prop of rule.style) {
                  if (!propMetas[prop]) {
                    continue
                  }
                  /**@type Map<string, any> */
                  const propMap = styles.get(element)
                  if (!propMap.has(prop)) {
                    propMap.set(prop, [])
                  }

                  propMap.get(prop).push({
                    priority,
                    selector,
                    source: rule,
                  })
                }
              }
            }
          }
        }
        f(rule)
      }
    }

    for (const [ele, propMap] of styles) {
      for (const prop of ele.style) {
        if (!propMetas[prop]) {
          continue
        }
        if (!propMap.has(prop)) {
          propMap.set(prop, [])
        }
        propMap.get(prop).push({
          priority: 3,
          selector: '',
          source: ele,
        })
      }
    }

    for (const [ele, style] of styles) {
      const unsetProps = Array.from(Object.keys(propMetas)).filter(
        (p) => !style.has(p)
      )
      for (const values of style.values()) {
        values.sort((s) => s.priority)
      }
      for (const p of unsetProps) {
        const meta = propMetas[p]
        if (!meta.inheritance) {
          // style.set(p, [{ value: meta.initValue, unset: true }])
          continue
        }
        if (!ele.parentElement) {
          // style.set(p, [{ inheritance: true, unset: true }])
          continue
        }
        const parentProps = styles.get(ele.parentElement).get(p)
        if (!parentProps) {
          // style.set(p, [{ inheritance: true, unset: true }])
          continue
        }
        style.set(
          p,
          parentProps.map((p) =>
            Object.assign({}, p, {
              priority: p.priority - 10,
              inheritance: true,
            })
          )
        )
      }
    }

    return styles
  }

  const attachDragMove = (document, target, moved) => {
    let isMoving = false
    let offsetTop
    let offsetLeft
    let screenX
    let screenY
    const getPos = (ev) => {
      if (ev.touches) {
        return ev.touches[0]
      } else {
        return ev
      }
    }
    const dragStart = (ev) => {
      isMoving = true
      ;({ screenX, screenY } = getPos(ev))
      ;({ offsetTop, offsetLeft } = target)
    }
    const dragEnd = (ev) => {
      if (isMoving && moved) {
        setTimeout(() => {
          try {
            moved(target)
          } catch (e) {
            console.log(e.stack)
          }
        }, 0)
      }
      isMoving = false
    }
    const drag = (ev) => {
      if (isMoving) {
        ev.preventDefault()
        const current = getPos(ev)
        const dx = current.screenX - screenX
        const dy = current.screenY - screenY
        target.style.left = dx + offsetLeft + 'px'
        target.style.top = dy + offsetTop + 'px'
      }
    }
    target.addEventListener('mousedown', dragStart, false)
    document.addEventListener('mouseup', dragEnd, false)
    document.addEventListener('mousemove', drag, false)
    target.addEventListener('touchstart', dragStart, false)
    document.addEventListener('touchend', dragEnd, false)
    document.addEventListener('touchmove', drag, { passive: false })
  }

  const getRegion = (start, end, triger) => {
    let beginX, beginY, endX, endY
    let left = start.offsetLeft + start.offsetWidth / 2
    let top = start.offsetTop + start.offsetHeight / 2

    let right = end.offsetLeft + end.offsetWidth / 2
    let bottom = end.offsetTop + end.offsetHeight / 2
    if (start == triger) {
      beginX = left
      beginY = top
      endX = right
      endY = bottom
    } else {
      beginX = right
      beginY = bottom
      endX = left
      endY = top
    }
    if (left > right) {
      let tmp = right
      right = left
      left = tmp
    }
    if (top > bottom) {
      let tmp = bottom
      bottom = top
      top = tmp
    }

    return { left, top, right, bottom, beginX, beginY, endX, endY }
  }

  function App(window) {
    this.mWindow = window
    this.mUIStyleContent = `
  @keyframes black-white{
    0%{
      color:lightblue;
    }
    1%{
      color:lightblue
    }
    30%{
      color:lightslategrey;
    }
    70%{
      color:lightslategrey;
    }
    99%{
      color:lightblue
    }
    100%{
      color:lightblue;
    }
  }
  :root{
    --color:#ccc;
  }
  .root{
    z-index:999;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fffffff0;
    margin: 10px;
    box-shadow: 1px 1px 3px black;
    padding: 10px;
    border-radius: 8px;
    height: 25vh;
    display: flex;
    flex-direction: column;
    color: #333;
    font-size: small;
  }
  .menu{
    display: flex;
  }
  .console{
    background: lightslategrey;
    color: white;
    overflow: auto;
    display: none;
    flex:1;
  }
  .console.enable{
    display:block;
  }
  .console-line{
    line-height:1.4em;
  }
  .menu-item{
    flex:1;
    text-align: center;
    color: #333;
  }
  .menu-item.enable{
    color:white;
    background:lightskyblue;
  }
  .start,.end{
    font-size: 2em;
    position: fixed;
    animation: black-white 2s ease-in-out infinite alternate;
    left:20px;
    top:20%;
  }
  .display-panel{
    flex: 1;
    overflow: auto;
  }
  .style-group{
    padding: 0px;
  }
  .group-item-title{
    font-weight: bolder;
  }
  .style-group-title{
    background: lightblue;
  }
  .group-item{
    margin:0;
    line-height: 1.4em;
  }
  .group-item>.prop{
    color: #eee;
    background: lightcoral;
    padding: 0px 5px;
  }
  .group-item>.value{
    margin-left: 5px;
  }
  .group-item-disable>.prop{
    background:lightgray;
  }
  `
    this.mHightlightClass = 'm_style_viewer_highlight_class'
    this.mInjectStyleContent = `
    @keyframes ${this.mHightlightClass}-black-white{
      0%{
        outline-color:lightblue;
      }
      1%{
        outline-color:lightblue
      }
      30%{
        outline-color:lightslategrey;
      }
      70%{
        outline-color:lightslategrey;
      }
      99%{
        outline-color:lightblue
      }
      100%{
        outline-color:lightblue;
      }
    }
  .${this.mHightlightClass}{
    outline: black solid;
    animation: ${this.mHightlightClass}-black-white 2s ease-in-out infinite alternate;
  }
  `
    this.mSelect = (ele, displayProps) => {
      if (this.mSelectedElement === ele) {
        return
      }
      if (this.mSelectedElement) {
        this.mSelectedElement.classList.remove(this.mHightlightClass)
      }
      this.mSelectedElement = ele
      this.mSelectedElement.classList.add(this.mHightlightClass)
      this.mRefreshStyleDisplay(ele, displayProps)
    }
    this.mUpdateSelections = (triger) => {
      const region = getRegion(this.mStart, this.mEnd, triger)
      const { left, top, right, bottom, beginX, beginY, endX, endY } = region
      const filter = (e) => e !== this.mShadow
      const atBegins = new Set(
        document.elementsFromPoint(beginX, beginY).filter(filter)
      )

      const elements = document
        .elementsFromPoint(endX, endY)
        .filter((e) => filter(e) && atBegins.has(e))
      this.mRefreshSelections(elements)
    }
    this.mRefreshSelections = (elements) => {
      this.mSelections = elements
      this.mSelectionStyles = getAffectedStyles(
        Array.from(document.styleSheets).filter(
          (s) => s.ownerNode != this.mInjectStyle
        ),
        PropMetas,
        elements
      )
      this.mSelect(elements[0], PropMetas)
    }

    this.mRebuildStyles = (eleStyles, displayProps) => {
      //StylePropertyMap
      const sources = new Map()
      for (const [eleProp, values] of eleStyles) {
        for (const { source, priority } of values) {
          if (!sources.has(source)) {
            const styles = new Map()
            for (const prop of source.style) {
              if (!displayProps[prop]) {
                continue
              }
              styles.set(prop, { value: source.style[prop] })
            }
            sources.set(source, { priority, styles })
          }
        }
        const affectedValue = values[values.length - 1]
        if (affectedValue) {
          const prop = sources.get(affectedValue.source).styles.get(eleProp)
          if (prop) {
            prop.affected = true
          }
        }
      }

      return Array.from(sources)
        .sort(([_, styles]) => styles.priority)
        .map((s) => ({
          source: s[0],
          styles: s[1].styles,
        }))
    }
    this.mRefreshStyleDisplay = (ele, displayProps) => {
      const styles = this.mRebuildStyles(
        this.mSelectionStyles.get(ele),
        displayProps
      ).reverse()
      this.mStylesPanel.innerHTML = ''
      for (const style of styles) {
        const group = document.createElement('div')
        group.classList.add('style-group')
        const groupTitle = document.createElement('div')
        groupTitle.classList.add('style-group-title')
        groupTitle.innerText = style.source.selectorText || 'embeded'
        group.appendChild(groupTitle)
        for (const [prop, { value, affected }] of style.styles) {
          const groupItem = document.createElement('div')
          groupItem.classList.add('group-item')
          const propEle = document.createElement('span')
          propEle.innerText = prop
          propEle.classList.add('prop')
          const valueEle = document.createElement('span')
          valueEle.innerText = value
          valueEle.classList.add('value')
          groupItem.appendChild(propEle)
          groupItem.appendChild(valueEle)
          if (!affected) {
            groupItem.classList.add('group-item-disable')
          }
          group.appendChild(groupItem)
        }
        this.mStylesPanel.appendChild(group)
      }
    }
    this.mInitComponents = () => {
      if (this.mShadow) {
        return
      }
      const { shadowElement, shadow } = createShadow()
      const start = document.createElement('span')
      start.classList.add('start')
      start.innerText = '⦿'
      const end = document.createElement('span')
      end.innerText = '⊗'
      end.classList.add('end')
      attachDragMove(this.mWindow.document, start, () => {
        end.style.left = start.offsetLeft + start.offsetWidth + 'px'
        end.style.top = start.offsetTop + 'px'
        this.mUpdateSelections(end)
      })
      attachDragMove(this.mWindow.document, end, this.mUpdateSelections)
      const root = document.createElement('div')
      root.classList.add('root')
      const menu = document.createElement('div')
      menu.classList.add('menu')
      const menuItems = [
        {
          name: '捕获',
          onclick: (e) => {
            this.mUpdateSelections(end)
          },
        },
        {
          name: '控制台',
          onclick: (e) => {
            this.mLogConsole = !this.mLogConsole
            if (this.mLogConsole) {
              e.classList.add('enable')
              this.mConsole.classList.add('enable')
            } else {
              e.classList.remove('enable')
              this.mConsole.classList.remove('enable')
              this.mConsole.innerHTML = ''
            }
          },
        },
      ]
      menuItems.forEach((item) => {
        const i = document.createElement('div')
        i.classList.add('menu-item')
        i.innerText = item.name
        i.onclick = () => item.onclick(i)
        menu.appendChild(i)
      })
      const cons = document.createElement('div')
      cons.classList.add('console')
      const stylesPanel = document.createElement('div')
      stylesPanel.classList.add('display-panel')
      root.appendChild(menu)
      root.appendChild(cons)
      root.appendChild(stylesPanel)
      root.appendChild(end)
      root.appendChild(start)
      const uiStyle = document.createElement('style')
      uiStyle.innerText = this.mUIStyleContent
      shadow.appendChild(root)
      shadow.appendChild(uiStyle)
      this.mShadow = shadowElement
      this.mWindow.document.body.appendChild(shadowElement)
      this.mStart = start
      this.mConsole = cons
      this.mEnd = end
      this.mStylesPanel = stylesPanel
      const injectStyle = document.createElement('style')
      injectStyle.innerText = this.mInjectStyleContent
      this.mInjectStyle = injectStyle
      this.mWindow.document.body.appendChild(this.mInjectStyle)
    }
    this.mMaxConsoleLines = 200
    this.mLog = (...args) => {
      if (!this.mLogConsole) {
        return
      }
      this.mConsoleLines = this.mConsoleLines || []
      const ne = document.createElement('div')
      ne.classList.add('console-line')
      this.mConsole.appendChild(ne)
      ne.innerText = args.map((arg) => JSON.stringify(arg)).join('\n')
      this.mConsoleLines.push(ne)
      if (this.mConsoleLines > this.mMaxConsoleLines) {
        const e = this.mConsoleLines.shift()
        this.mConsole.removeChild(e)
      }
    }
    this.launch = async () => {
      const savedLog = this.mWindow.console.log
      let log = (...args) => {
        this.mLog(...args)
        savedLog.call(this.mWindow.console, ...args)
      }
      this.mWindow.console.log = log
      this.mInitComponents()
    }
  }

  const styleViewer = new App(window)
  window.__m_style_viewer_instance = styleViewer
  await styleViewer.launch()
})(window)