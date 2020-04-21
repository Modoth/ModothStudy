import { toDataUrl } from '../commons/todataurl.js';
import { Modal } from '../modal/index.js';

export class App {
  constructor(window) {
    this.window_ = window;
  }
  async launch() {
    this.logoContainer_ = document.getElementById('logoContainer');
    this.btnInputFile_ = document.getElementById('btnInputFile');
    /**@type HTMLInputElement */
    this.inputFile_ = document.getElementById('inputFile');
    this.dataUrl_ = document.getElementById('dataUrl');
    this.fontStyle_ = document.getElementById('styleFont');
    /**@type HTMLImageElement */
    this.previewImage_ = document.getElementById('previewImage');
    this.previewFont_ = document.getElementById('previewFont');
    this.previews_ = [this.previewImage_, this.previewFont_];
    this.btnCopy_ = document.getElementById('btnCopy');
    this.btnInputFile_.addEventListener('click', () => {
      this.isLoadingFile_ || this.inputFile_.click();
    })
    this.logoContainer_.addEventListener('click', () => {
      this.isLoadingFile_ || this.inputFile_.click();
    })
    this.inputFile_.addEventListener('change', () => {
      if (this.inputFile_.files && this.inputFile_.files[0]) {
        this.loadFile_(this.inputFile_.files[0]);
      }
    })
    this.dataUrl_.addEventListener('click', () => this.copyUrl_())
    this.btnCopy_.addEventListener('click', () => this.copyUrl_())
  }

  copyUrl_() {
    let range = document.createRange();
    range.selectNode(this.dataUrl_);
    let selection = window.getSelection()
    selection.removeAllRanges();
    selection.addRange(range);
    if (document.execCommand('copy')) {
      new Modal().toast('复制成功')
    }
    selection.removeAllRanges();
  }

  async loadFile_(/**@type File*/file) {
    this.isLoadingFile_ = true;
    const dataUrl = await toDataUrl(file);
    this.logoContainer_.classList.add('hidden');
    const meta = this.getFileMeta_(file.name, dataUrl);
    const { type } = meta;
    this.previews_.forEach(p => p.classList.add('hidden'))
    switch (type) {
      case 'image':
        this.previewImage_.classList.remove('hidden')
        this.previewImage_.src = dataUrl;
        break;
      case 'font':
        this.fontStyle_.innerText =
          `@font-face {
          font-family: 'preview-font';
          src: url("${dataUrl}");
          font-weight: normal;
          font-style: normal;
      }
      `;
        this.previewFont_.classList.remove('hidden');
        break;
    }
    this.dataUrl_.classList.remove('hidden');
    this.dataUrl_.innerText = dataUrl;
    this.isLoadingFile_ = false;
  }

  getFileMeta_(/**@type string*/fileName, /**@type string*/dataUrl) {
    const head = dataUrl.slice(0, dataUrl.indexOf(','));
    const match = head.match(/^data:((\w+)\/(\w+))*.*$/i);
    let type = match && match[2] && match[2].toLocaleLowerCase();
    switch (type) {
      case 'image':
        return { type };
    }
    const fileExt = fileName.slice(fileName.lastIndexOf('.') + 1).toLocaleLowerCase();
    switch (fileExt) {
      case 'woff2':
      case 'ttf':
        return { type: 'font' };
    }
    return {}
  }
}