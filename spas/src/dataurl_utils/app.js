import { toDataUrl } from '../commons/todataurl.js';
import { Modal } from '../modal/index.js';

export class App {
  constructor(window) {
    this.mWindow = window;
  }
  async launch() {
    this.mBtnInputFile = document.getElementById('btnInputFile');
    /**@type HTMLInputElement */
    this.mInputFile = document.getElementById('inputFile');
    this.mDataUrl = document.getElementById('dataUrl');
    /**@type HTMLImageElement */
    this.mPreviewImage = document.getElementById('previewImage');
    this.mPreviews = [this.mPreviewImage];
    this.mBtnCopy = document.getElementById('btnCopy');
    this.mBtnInputFile.addEventListener('click', () => {
      this.mIsLoadingFile || this.mInputFile.click();
    })
    this.mInputFile.addEventListener('change', () => {
      if (this.mInputFile.files && this.mInputFile.files[0]) {
        this.mLoadFile(this.mInputFile.files[0]);
      }
    })
    this.mBtnCopy.addEventListener('click', () => this.mCopyUrl())
  }

  mCopyUrl() {
    let range = document.createRange();
    range.selectNode(this.mDataUrl);
    let selection = window.getSelection()
    selection.removeAllRanges();
    selection.addRange(range);
    if (document.execCommand('copy')) {
      new Modal().toast('复制成功')
    }
    selection.removeAllRanges();
  }

  async mLoadFile(file) {
    this.mIsLoadingFile = true;
    const dataUrl = await toDataUrl(file);
    const head = dataUrl.slice(0, dataUrl.indexOf(','));
    const match = head.match(/^data:((\w+)\/(\w+))*.*$/i);
    const type = match && match[2] && match[2].toLocaleLowerCase();
    this.mPreviews.forEach(p => p.classList.add('hiden'))
    switch (type) {
      case 'image':
        this.mPreviewImage.classList.remove('hiden')
        this.mPreviewImage.src = dataUrl;
        break;
    }
    this.mDataUrl.innerText = dataUrl;
    this.mIsLoadingFile = false;
  }
}