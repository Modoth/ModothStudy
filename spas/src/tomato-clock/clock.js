export class HTMLClockElement extends HTMLElement {
  static get nodeName() {
    return 'h-clock'
  }
  static get timeAttrName() {
    return 'time'
  }
  static get stateAttrName() {
    return 'state'
  }
  static get handsAttrName() {
    return 'hands'
  }
  static get observedAttributes() {
    return [
      HTMLClockElement.timeAttrName,
      HTMLClockElement.handsAttrName,
      HTMLClockElement.stateAttrName,
    ]
  }
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'closed' })
    shadow.appendChild(/**@imports css */ 'clock.css')
    const view = /**@imports html */ 'clock.html'
    shadow.appendChild(view)
    /**@type HTMLElement */
    this.hourHand_ = shadow.querySelector('.hour-hand')
    /**@type HTMLElement */
    this.minuteHand_ = shadow.querySelector('.minute-hand')
    /**@type HTMLElement */
    this.secondHand_ = shadow.querySelector('.second-hand')
    /**@type HTMLElement */
    this.center_ = shadow.querySelector('.center')
    this.center_.onclick = (ev) => {
      ev.stopPropagation()
      this.onstateclick && this.onstateclick(ev)
    }
    this.updateTime_(this.getAttribute(HTMLClockElement.timeAttrName))
    this.updateHandsVisibility_(
      this.getAttribute(HTMLClockElement.handsAttrName)
    )
  }

  updateState_(state) {
    this.state_ = state
    if (this.state_) {
      this.center_.classList.add('enabled')
    } else {
      this.center_.classList.remove('enabled')
    }
  }

  getHandTransform(value, total) {
    return `translate(-50%, -50%) rotate(${
      -90 + Math.floor((360 * value) / total)
    }deg)`
  }

  updateTime_(/**@type string */ timeStr) {
    let hours = 0
    let minute = 0
    let second = 0
    if (timeStr) {
      const tokens = timeStr.split(':')
      second = parseInt(tokens[2]) || 0
      minute = parseInt(tokens[1]) || 0 + second / 60
      hours = parseInt(tokens[0]) || 0 + minute / 60
    }
    this.hourHand_.style.transform = this.getHandTransform(hours, 12)
    this.minuteHand_.style.transform = this.getHandTransform(minute, 60)
    this.secondHand_.style.transform = this.getHandTransform(second, 60)
  }

  updateHandsVisibility_(hands) {
    let showHours = true
    let showMinutes = true
    let showSeconds = true
    if (hands) {
      const handsSet = new Set(hands)
      showHours = handsSet.has('H')
      showMinutes = handsSet.has('M')
      showSeconds = handsSet.has('S')
    }
    this.hourHand_.style.opacity = showHours ? 1 : 0
    this.minuteHand_.style.opacity = showMinutes ? 1 : 0
    this.secondHand_.style.opacity = showSeconds ? 1 : 0
  }

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case HTMLClockElement.timeAttrName:
        this.updateTime_(newValue)
        break
      case HTMLClockElement.handsAttrName:
        this.updateHandsVisibility_(newValue)
        break
      case HTMLClockElement.stateAttrName:
        this.updateState_(newValue === 'true')
        break
    }
  }
}

customElements.define(HTMLClockElement.nodeName, HTMLClockElement)
