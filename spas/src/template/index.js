import {
    App
} from './app.js'

window.onload = async () => {
    const app = new App(document.getElementById('app'), window.appData);
    window.app = app;
    await app.start();
}