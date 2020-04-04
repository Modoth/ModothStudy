export class App {
    constructor(root, appData) {
        this.mRoot = root;
        this.mInitAppData = appData;
    }

    async start() {
        console.log(this.mRoot);
    }
}