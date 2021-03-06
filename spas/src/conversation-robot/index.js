import {
    App
} from './app.js'

window.onload = async () => {
    const app = new App(window);
    window.app = app;
    await app.start();
    if (window.onAppLoaded) {
        window.onAppLoaded();
    }
}