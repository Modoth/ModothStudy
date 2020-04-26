export class HTMLTagsElement extends HTMLElement {
  static get nodeName() {
    return 'h-tags'
  }
  static get tagsAttrName() {
    return 'tags'
  }
  static get valueAttrName() {
    return 'value'
  }
  static get observedAttributes() {
    return [HTMLTagsElement.tagsAttrName, HTMLTagsElement.valueAttrName]
  }
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'closed' })
    shadow.appendChild(/**@imports css */ 'tags.css')
    const view = /**@imports html */ 'tags.html'
    shadow.appendChild(view)
    this.shadow_ = shadow
    /**@type Map<string, HTMLElement> */
    this.tagsDict = new Map()
    /**@type HTMLElement */
    this.tagsList_ = shadow.querySelector('.tags')
    this.updateTags_(this.getAttribute(HTMLTagsElement.tagsAttrName))
    this.valueElement_ = shadow.querySelector('.value')
    // /**@type HTMLElement */
    // this.minuteHand_ = shadow.querySelector('.minute-hand')
    // /**@type HTMLElement */
    // this.secondHand_ = shadow.querySelector('.second-hand')
    // this.updateTime_(this.getAttribute(HTMLTagsElement.tagsAttrName))
    // this.updateHandsVisibility_(
    //   this.getAttribute(HTMLTagsElement.valueAttrName)
    // )
  }

  selectTag_(e) {}

  updateTags_(/**@type string */ tagStr) {
    this.tagsList_.innerHTML = ''
    this.tagsDict = new Map()
    if (!tagStr) {
      return
    }
    const tags = new Set(
      tagStr
        .split(' ')
        .map((t) => t.trim())
        .filter((t) => t)
    )
    for (const tag of tags) {
      const e = document.createElement('div')
      e.classList.add('tag')
      e.style.backgroundColor = tag
      e.onclick = (ev) => {
        ev.stopPropagation()
        this.setAttribute(HTMLTagsElement.valueAttrName, tag)
        if (this.onchange) {
          this.onchange(new CustomEvent('change'))
        }
      }
      this.tagsDict.set(tag, e)
      this.tagsList_.appendChild(e)
    }
    this.updateValue_(this.value_)
  }

  updateValue_(/**@type string */ value) {
    if (this.tagsDict.has(this.value_)) {
      this.tagsDict.get(this.value_).classList.remove('selected')
    }
    value = value && value.trim()
    this.value_ = value
    this.valueElement_.innerText = value
    if (this.tagsDict.has(this.value_)) {
      this.tagsDict.get(this.value_).classList.add('selected')
    }
  }

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case HTMLTagsElement.tagsAttrName:
        this.updateTags_(newValue)
        break
      case HTMLTagsElement.valueAttrName:
        this.updateValue_(newValue)
        break
    }
  }
}

customElements.define(HTMLTagsElement.nodeName, HTMLTagsElement)
