import { App } from './app.js'
import { AppData } from './app-data.js'

const normlizeAppData = (appData) => {
  return appData
}

window.onload = async () => {
  const app = new App(window, normlizeAppData(window.appData || AppData))
  window.app = app
  await app.launch()
}
