import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Configs } from 'src/app/apis';

class MaskAnchor {
  constructor(
    public x: number,
    public y: number,
    public i: number,
    public j: number
  ) {}
}

class MaskAnchorCollection {
  constructor(
    public top: number,
    public right: number,
    public bottom: number,
    public left: number
  ) {
    this.anchors = [];
    this.anchorRec = [];
    for (var j = 0; j < 3; j++) {
      let row = [];
      this.anchorRec.push(row);
      for (var i = 0; i < 3; i++) {
        let point = new MaskAnchor(0, 0, i, j);
        row.push(point);
        this.anchors.push(point);
      }
    }
    this.resize(top, right, bottom, left);
  }
  resize(top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    let center = Math.floor((right + left) / 2);
    let middle = Math.floor((bottom + top) / 2);
    for (let i = 0; i < 3; i++) {
      this.anchorRec[0][i].y = top;
      this.anchorRec[1][i].y = middle;
      this.anchorRec[2][i].y = bottom;

      this.anchorRec[i][0].x = left;
      this.anchorRec[i][1].x = center;
      this.anchorRec[i][2].x = right;
    }
  }
  public clone() {
    return new MaskAnchorCollection(
      this.top,
      this.right,
      this.bottom,
      this.left
    );
  }
  public anchorRec: MaskAnchor[][]; //(i,j)=>[j][i]
  public anchors: MaskAnchor[];
}

class ImageCroper implements OnDestroy {
  ngOnDestroy(): void {
    this.canvas.removeEventListener('touchstart', this.startMove);
    this.canvas.removeEventListener('touchmove', this.move);
    this.canvas.removeEventListener('touchend', this.stopMove);
    this.canvas.removeEventListener('touchcancel', this.stopMove);
    this.canvas.removeEventListener('mousedown', this.startMove);
    this.canvas.removeEventListener('mousemove', this.move);
    this.canvas.removeEventListener('mouseup', this.stopMove);
    this.canvas.removeEventListener('mouseleave', this.stopMove);
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  constructor(
    public canvas: HTMLCanvasElement,
    public shadowStyle = '#00000040',
    public archorStyle = 'white',
    public archR = 2
  ) {
    this.archD = this.archR * 2;
    this.anchorFindR = Math.pow(
      (this.canvas.width / this.canvas.offsetWidth) * 48,
      2
    );
    let width = this.canvas.width;
    let height = this.canvas.height;
    this.anchors = new MaskAnchorCollection(0, width, height, 0);
    this.canvas.addEventListener('touchstart', this.startMove);
    this.canvas.addEventListener('touchmove', this.move);
    this.canvas.addEventListener('touchend', this.stopMove);
    this.canvas.addEventListener('touchcancel', this.stopMove);
    this.canvas.addEventListener('mousedown', this.startMove);
    this.canvas.addEventListener('mousemove', this.move);
    this.canvas.addEventListener('mouseup', this.stopMove);
    this.canvas.addEventListener('mouseleave', this.stopMove);
    this.drawMask();
  }

  public moveingAnchor: MaskAnchor;

  public movingInterval = 10;

  public anchorFindR = 0;

  public lastMoveTime = -1;

  public moveStartPos: { x: number; y: number };

  public statuses: { ratio: number; archors: MaskAnchorCollection }[] = [];

  public getPointInCanvas(e: any): { x: number; y: number } {
    if (e.touches) {
      e = e.touches[0];
    }
    let c: HTMLCanvasElement = e.target;
    let ratio = c.width / c.offsetWidth;
    return {
      x: Math.floor(
        Math.ceil(e.clientX - c.offsetLeft + c.offsetWidth / 2) * ratio
      ),
      y: Math.floor((e.clientY - c.offsetTop) * ratio),
    };
  }

  public findMovingAnchor({ x, y }): MaskAnchor {
    let ma = null;
    let closestA = this.anchorFindR;
    for (let a of this.anchors.anchors) {
      let dist = Math.pow(a.x - x, 2) + Math.pow(a.y - y, 2);
      if (dist <= closestA) {
        ma = a;
        closestA = dist;
      }
    }
    return ma;
  }

  public startMove = (e) => {
    if (this.moveingAnchor) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    let pos = this.getPointInCanvas(e);
    this.moveingAnchor = this.findMovingAnchor(pos);
    this.lastMoveTime = -1;
    this.moveStartPos = pos;
    this.statuses.push({
      ratio: this.cropRatio,
      archors: this.anchors.clone(),
    });
  };

  public move = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!this.moveingAnchor) {
      return;
    }
    let now = Date.now();
    if (now - this.lastMoveTime < this.movingInterval) {
      return;
    }
    this.lastMoveTime = now;
    let currentPos = this.getPointInCanvas(e);
    this.moveAnchors(
      this.anchors,
      this.statuses[this.statuses.length - 1].archors,
      currentPos.x - this.moveStartPos.x,
      currentPos.y - this.moveStartPos.y
    );
    this.drawMask();
  };

  public moveAnchors(
    current: MaskAnchorCollection,
    start: MaskAnchorCollection,
    dx: number,
    dy: number
  ) {
    let { top, right, bottom, left } = start;
    let { i, j } = this.moveingAnchor;
    if (i === 1 && j === 1) {
      if (left + dx < 0) {
        dx = -left;
      } else if (right + dx > this.canvas.width) {
        dx = this.canvas.width - right;
      }

      if (top + dy < 0) {
        dy = -top;
      } else if (bottom + dy > this.canvas.height) {
        dy = this.canvas.height - bottom;
      }
      left += dx;
      right += dx;
      top += dy;
      bottom += dy;
    } else {
      if (this.cropRatio && (i === 1 || j === 1)) {
        return;
      }
      if (j === 0) {
        top += dy;
      } else if (j === 2) {
        bottom += dy;
      }
      if (i === 0) {
        left += dx;
      } else if (i === 2) {
        right += dx;
      }
      if (left > right || top > bottom) {
        return;
      }

      if (this.cropRatio) {
        let width = right - left;
        let height = bottom - top;
        let rheight = width / this.cropRatio;
        if (j === 0) {
          top += height - rheight;
        } else if (j === 2) {
          bottom += rheight - height;
        }

        if (
          0 > left ||
          right > this.canvas.width ||
          0 > top ||
          bottom > this.canvas.height
        ) {
          return;
        }
      } else {
        top = Math.max(0, top);
        right = Math.min(this.canvas.width, right);
        bottom = Math.min(this.canvas.height, bottom);
        left = Math.max(0, left);
      }
    }
    current.resize(top, right, bottom, left);
  }

  public revertEdit() {
    let status = this.statuses.pop();
    this.anchors = status.archors;
    this.cropRatio = status.ratio;
    this.drawMask();
  }

  public stopMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!this.moveingAnchor) {
      return;
    }
    this.moveingAnchor = null;
    this.moveStartPos = null;
  };

  public anchors: MaskAnchorCollection;

  public cropRatio = NaN;

  public cropRect() {
    return this.anchors;
  }

  public drawMask() {
    console.log(this.anchors);
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //SHADOW
    let width = this.canvas.width;
    let height = this.canvas.height;
    let { top, right, bottom, left } = this.cropRect();
    ctx.fillStyle = this.shadowStyle;
    ctx.beginPath();
    ctx.rect(0, 0, width, top);
    ctx.rect(0, 0, left, height);
    ctx.rect(0, bottom, width, height - bottom);
    ctx.rect(right, 0, width - right, height);
    ctx.fill();
    //ANCHOR
    ctx.fillStyle = this.archorStyle;
    ctx.beginPath();

    for (var a of this.anchors.anchors) {
      ctx.rect(a.x - this.archR, a.y - this.archR, this.archD, this.archD);
    }
    ctx.fill();
  }

  public archD: number;

  public setCropRatio(ratio) {
    if (this.cropRatio === ratio) {
      return;
    }
    this.statuses.push({
      ratio: this.cropRatio,
      archors: this.anchors.clone(),
    });
    this.cropRatio = ratio;
    if (!this.cropRatio) {
      return;
    }
    let { left, right, top, bottom } = this.cropRect();
    let width = right - left;
    let height = bottom - top;
    if (height * ratio < width) {
      let dwidth = Math.floor(height * ratio);
      this.anchors.resize(top, left + dwidth, bottom, left);
    } else {
      let dheight = Math.floor(width / ratio);
      this.anchors.resize(top, right, top + dheight, left);
    }
    this.drawMask();
  }
}

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
})
export class ImageEditorComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.croper) {
      this.croper.ngOnDestroy();
    }
  }

  public _image: Blob;

  public imgType: string = 'image/jpeg';

  @Input() maxImageSize: number;

  @Output() onError = new EventEmitter<string>();

  @Input() set image(newImage: Blob) {
    this._image = newImage;
    this.loadImage();
  }

  public croper: ImageCroper;

  public startOp(op) {
    this.croper = new ImageCroper(this.canvasMaskRef.nativeElement);
    this.currentOp = op;
  }

  public cancleCrop() {
    this.currentOp = this;
    this.croper.ngOnDestroy();
    this.croper = null;
  }

  public applyCrop() {
    this.currentOp = this;
    let { top, right, bottom, left } = this.croper.cropRect();
    this.croper.ngOnDestroy();
    this.croper = null;
    top = Math.floor(top * this.maskRatio);
    right = Math.floor(right * this.maskRatio);
    bottom = Math.floor(bottom * this.maskRatio);
    left = Math.floor(left * this.maskRatio);
    let width = right - left + 1;
    let height = bottom - top + 1;
    let imgData =
      this.imagesDatas && this.imagesDatas[this.imagesDatas.length - 1];
    if (!imgData) {
      return;
    }
    let newImgData = new ImageData(width, height);
    let data = imgData.data;
    let nData = newImgData.data;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        let nidx = (i + j * width) * 4;
        let idx = (i + left + (j + top) * imgData.width) * 4;
        nData[nidx] = data[idx];
        nData[nidx + 1] = data[idx + 1];
        nData[nidx + 2] = data[idx + 2];
        nData[nidx + 3] = data[idx + 3];
      }
    }
    this.updateImageData(newImgData);
  }

  public currentOp: any = this;

  public ops = [
    {
      func: () => {
        this.revertEdit();
      },
      hidden: () => !this.imagesDatas || this.imagesDatas.length < 2,
      icon: 'undo',
    },
    {
      func: (op) => {
        this.startOp(op);
      },
      icon: 'crop',
      ops: [
        {
          func: () => {
            this.cancleCrop();
          },
          icon: 'close',
        },
        {
          func: () => {
            this.croper.revertEdit();
          },
          hidden: () =>
            !this.croper.statuses || this.croper.statuses.length < 1,
          icon: 'undo',
        },
        {
          func: () => {
            this.croper.setCropRatio(16 / 9);
          },
          icon: 'crop_16_9',
        },
        {
          func: () => {
            this.croper.setCropRatio(3 / 2);
          },
          icon: 'crop_3_2',
        },
        {
          func: () => {
            this.croper.setCropRatio(1);
          },
          icon: 'crop_din',
        },
        {
          func: () => {
            this.croper.setCropRatio(NaN);
          },
          icon: 'crop_free',
        },
        {
          func: () => {
            this.applyCrop();
          },
          icon: 'check',
        },
      ],
    },
    {
      func: () => {
        this.execEdit(this.rotateLeft);
      },
      icon: 'rotate_left',
    },
    {
      func: () => {
        this.execEdit(this.rotateRight);
      },
      icon: 'rotate_right',
    },
    {
      func: () => {
        this.cancle();
      },
      icon: 'close',
    },
    {
      func: () => {
        this.apply();
      },
      icon: 'check',
    },
  ];

  @Output() closed = new EventEmitter<Blob>();

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasMask') canvasMaskRef: ElementRef<HTMLCanvasElement>;

  constructor(public somSanitizer: DomSanitizer) {}

  ngOnInit() {}

  public async getImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      var img: HTMLImageElement = window.document.createElement('img');
      let imgUrl = window.URL.createObjectURL(blob);
      img.src = imgUrl;
      this.somSanitizer.bypassSecurityTrustUrl(imgUrl);
      img.onload = () => {
        window.URL.revokeObjectURL(imgUrl);
        resolve(img);
      };
    });
  }

  public imagesDatas: ImageData[];

  public rotateRight(imageData: ImageData) {
    let newImageData = new ImageData(imageData.height, imageData.width);
    let { data, width, height } = imageData;
    let nd = newImageData.data;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        let nIdx = (i * height + (height - j)) * 4;
        let idx = (j * width + i) * 4;
        nd[nIdx] = data[idx];
        nd[nIdx + 1] = data[idx + 1];
        nd[nIdx + 2] = data[idx + 2];
        nd[nIdx + 3] = data[idx + 3];
      }
    }
    return newImageData;
  }

  public rotateLeft(imageData: ImageData) {
    let newImageData = new ImageData(imageData.height, imageData.width);
    let { data, width, height } = imageData;
    let nd = newImageData.data;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        let nIdx = ((width - i) * height + j) * 4;
        let idx = (j * width + i) * 4;
        nd[nIdx] = data[idx];
        nd[nIdx + 1] = data[idx + 1];
        nd[nIdx + 2] = data[idx + 2];
        nd[nIdx + 3] = data[idx + 3];
      }
    }
    return newImageData;
  }

  public revertEdit() {
    if (!this.imagesDatas || this.imagesDatas.length < 2) {
      return;
    }
    this.imagesDatas.pop();
    this.updateImageData(this.imagesDatas.pop());
  }

  public execEdit(func: (data: ImageData) => ImageData) {
    if (!func) {
      return;
    }
    let data =
      this.imagesDatas && this.imagesDatas[this.imagesDatas.length - 1];
    if (!data) {
      return;
    }
    let newData = func(data);
    this.updateImageData(newData);
  }

  public async loadImage() {
    let canvas = this.canvasRef.nativeElement;
    let img = await this.getImage(this._image);
    this.updateCanvasWidth(canvas, img.naturalWidth, img.naturalHeight);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    this.imagesDatas = [];
    this.imagesDatas.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  public async apply() {
    if (
      this.imagesDatas.length === 1 &&
      (this._image.type === 'image/gif' ||
        this._image.type === 'image/svg+xml' ||
        this._image.type === 'image/png')
    ) {
      this.closed.emit(this._image);
      return;
    }
    const blob = await this.normanizeImage();
    if (this.maxImageSize && blob.size > this.maxImageSize) {
      this.onError.emit(Configs.ServiceMessagesEnum.FileToLarge.toString());
      return;
    }
    this.closed.emit(blob);
  }

  public async cancle() {
    this.closed.emit(null);
  }

  public async normanizeImage() {
    let canvas = this.canvasRef.nativeElement;
    let blob: Blob = await new Promise((resole) => {
      if (this.maxImageSize) {
        let q = this.maxImageSize / this._image.size;
        if (q < 1) {
          canvas.toBlob(resole, this.imgType, q / 5);
          return;
        }
      }
      canvas.toBlob(resole, this.imgType);
    });
    return blob;
  }

  public updateImageData(data: ImageData) {
    if (!data) {
      return;
    }
    this.imagesDatas.push(data);
    let canvas = this.canvasRef.nativeElement;
    this.updateCanvasWidth(canvas, data.width, data.height);
    let ctx = canvas.getContext('2d');
    ctx.putImageData(data, 0, 0);
  }

  public updateCanvasWidth(
    canvas: HTMLCanvasElement,
    naturalWidth,
    naturalHeight
  ) {
    let canvasMask = this.canvasMaskRef.nativeElement;
    if (naturalHeight < 1) {
      canvasMask.width = canvas.width = 0;
      canvasMask.height = canvas.height = 0;
      return;
    }
    let imgRatio = naturalWidth / naturalHeight;
    let maxWidth = canvas.parentElement.clientWidth;
    let maxHeight = canvas.parentElement.clientHeight;
    let requiredWidth = maxHeight * imgRatio;
    let width = 0,
      height = 0;
    if (requiredWidth > maxWidth) {
      width = maxWidth;
      height = maxWidth / imgRatio;
    } else {
      width = requiredWidth;
      height = maxHeight;
    }
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    canvasMask.style.width = width + 'px';
    canvasMask.style.height = height + 'px';
    canvasMask.width = width;
    canvasMask.height = height;
    this.maskRatio = naturalWidth / width;
  }

  public maskRatio = 0;
}
