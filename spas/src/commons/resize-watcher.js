export class ResizeWatcher {
  constructor(target) {
    /**@type Window & typeof globalThis*/
    this.mTarget = target
    this.mTarget.onresize = (ev) => this.mOnResize(ev)
    this.mResizeThreshold = 10
    this.mCallbacks = []
    this.mIsWatching = false
    this.mCheckThreshold = 200
  }
  register(callback) {
    callback && this.mCallbacks.push(callback)
    if (!this.mIsWatching) {
      this.mIsWatching = true
      this.mLastCheckTime = 0
      this.mLastW = this.mTarget.innerWidth
      this.mLastH = this.mTarget.innerHeight
    }
  }

  unregister(callback) {
    if (!callback) {
      return
    }
    const idx = this.mCallbacks.findIndex((c) => c === callback)
    if (idx < 0) {
      return
    }
    this.mCallbacks.splice(idx, 1)
    if (this.mCallbacks.length === 0) {
      this.mIsWatching = false
    }
  }

  mOnResize(/**@type UIEvent*/ ev) {
    if (!this.mIsWatching) {
      return
    }
    const now = Date.now()
    if (now - this.mLastCheckTime < this.mCheckThreshold) {
      return
    }
    this.mLastCheckTime = now
    let w = this.mTarget.innerWidth
    let h = this.mTarget.innerHeight

    if (
      Math.abs(this.mLastW - w) < this.mResizeThreshold &&
      Math.abs(this.mLastH - h) < this.mResizeThreshold
    ) {
      return
    }
    this.mLastW = w
    this.mLastH = h
    for (const callback of this.mCallbacks) {
      callback(w, h)
    }
  }
}
