import { toDataUrl } from '../commons/todataurl.js';
import { Modal } from '../modal/index.js';

export class App {
  constructor(window) {
    this.mWindow = window;
  }
  async launch() {
    this.mLogoContainer = document.getElementById('logoContainer');
    this.mBtnInputFile = document.getElementById('btnInputFile');
    /**@type HTMLInputElement */
    this.mInputFile = document.getElementById('inputFile');
    this.mDataUrl = document.getElementById('dataUrl');
    this.mFontStyle = document.getElementById('styleFont');
    /**@type HTMLImageElement */
    this.mPreviewImage = document.getElementById('previewImage');
    this.mPreviewFont = document.getElementById('previewFont');
    this.mPreviews = [this.mPreviewImage, this.mPreviewFont];
    this.mBtnCopy = document.getElementById('btnCopy');
    this.mBtnInputFile.addEventListener('click', () => {
      this.mIsLoadingFile || this.mInputFile.click();
    })
    this.mLogoContainer.addEventListener('click', () => {
      this.mIsLoadingFile || this.mInputFile.click();
    })
    this.mInputFile.addEventListener('change', () => {
      if (this.mInputFile.files && this.mInputFile.files[0]) {
        this.mLoadFile(this.mInputFile.files[0]);
      }
    })
    this.mDataUrl.addEventListener('click', () => this.mCopyUrl())
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

  async mLoadFile(/**@type File*/file) {
    this.mIsLoadingFile = true;
    const dataUrl = await toDataUrl(file);
    this.mLogoContainer.classList.add('hiden');
    const meta = this.mGetFileMeta(file.name, dataUrl);
    const { type } = meta;
    this.mPreviews.forEach(p => p.classList.add('hiden'))
    switch (type) {
      case 'image':
        this.mPreviewImage.classList.remove('hiden')
        this.mPreviewImage.src = dataUrl;
        break;
      case 'font':
        this.mFontStyle.innerText =
          `@font-face {
          font-family: 'preview-font';
          src: url("${dataUrl}");
          font-weight: normal;
          font-style: normal;
      }
      `;
        this.mPreviewFont.classList.remove('hiden');
        break;
    }
    this.mDataUrl.innerText = dataUrl;
    this.mIsLoadingFile = false;
  }

  mGetFileMeta(/**@type string*/fileName, /**@type string*/dataUrl) {
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