class App {
  view() {
    return [
      /**@imports css */ './app.css',
      /**@imports html */ './clock.html',
      /**@imports css */ './clock.css',
      /**@imports html */ './statistic.html',
      /**@imports css */ './statistic.css',
    ]
  }

  start() {
    console.log(this)
    debugger
  }
}