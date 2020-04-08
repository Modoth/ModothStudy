import { App } from './app.js'
import { AppData } from './appData.js';

window.onload = async () => {
    const app = new App(document.getElementById('app'), window.appData || AppData);
    window.app = app;
    await app.run();
}