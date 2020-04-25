export class HTMLClockElement extends HTMLElement {
  static get nodeName() {
    return 'h-clock'
  }
  static get timeAttrName() {
    return 'time'
  }
  static get handsAttrName() {
    return 'hands'
  }
  static get observedAttributes() {
    return [HTMLClockElement.timeAttrName, HTMLClockElement.handsAttrName]
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
    this.updateTime_(this.getAttribute(HTMLClockElement.timeAttrName))
    this.updateHandsVisibility_(
      this.getAttribute(HTMLClockElement.handsAttrName)
    )
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
      hours = parseInt(tokens[0]) || 0
      minute = parseInt(tokens[1]) || 0
      second = parseInt(tokens[2]) || 0
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
    }
  }
}

customElements.define(HTMLClockElement.nodeName, HTMLClockElement)
