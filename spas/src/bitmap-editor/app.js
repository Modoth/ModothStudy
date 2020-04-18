import { DragMoveCanvas } from '../commons/drag-move-canvas.js'

class App {
  constructor() {
    /**@type HTMLElement*/
    this.root
  }
  async initComponents() {
    this.canvas = new DragMoveCanvas()
    
  }
  async start() {}
}
