const GameStatus = {
    Stop: 0,
    Run: 1,
    Pause: 2,
    Resume: 3
}

export class Vector2 {
    constructor(/**@type number */x,/**@type number */y) {
        this.x = x * 1;
        this.y = y * 1;
    }

    toString() {
        return `x: ${this.x}, y: ${this.y}`;
    }

    distanceFrom(/**@type Vector2 */ other) {
        return Math.hypot(this.x - other.x, this.y - other.y);
        // return Math.sqrt(Math.pow(, 2) + Math.pow(this.y - other.y, 2))
    }
}

export class Gbject {
    constructor(name, x, y,/**@type Component[] */...components) {
        this.components = [];
        this.name = name;
        this.position = new Vector2(x, y);
        this.positionUpdated = true;
        this.addComponents(...components);
        this.enabled = true;
    }

    addComponents(/**@type Component[] */...components) {
        for (const c of components) {
            this.components.push(c);
            this[c.constructor.name] = c;
            c.gbject = this;
        }
    }
}

export class Component {
    constructor() {
        /**@type Gbject */
        this.gbject = null;
    }
}

export class AnimationController extends Component {
    constructor(animations) {
        super();
        this.animations_ = animations;
        this.animationStart_;
        this.animation = this.animations_[0];
        this.frame = 0;
        this.isPlaying = false;
    }
    stop() {
        this.isPlaying = false;
    }
    play(name) {
        let animation = this.animations_.find(a => a.name == name);
        if (animation == this.animation) {
            this.isPlaying = true;
            return;
        }
        if (animation) {
            this.animation = animation;
            this.frame = 0;
            this.animationStart_ = undefined;
            this.isPlaying = true;
        } else {
            this.isPlaying = false;
        }
    }
    onframe(/**@type GameContext */ctx) {
        if (!this.isPlaying || !this.animation) {
            return;
        }
        if (!this.animationStart_) {
            this.frame = 0;
            this.animationStart_ = ctx.current;
            return;
        }
        let animationLength = this.animation.frames.length;
        this.frame = Math.floor(((ctx.current - this.animationStart_) / 1000 / (this.animation.time || 1))
            * animationLength) % animationLength;
    }
}

export class Rigid extends Component {
    constructor(width = 1, height = 1) {
        super();
        this.size = new Vector2(width, height);
    }
}

export class Camera extends Component {
    constructor(/**@type number */ppu, /**@type boolean */enable) {
        super();
        this.ppu = ppu * 1;
        this.enable = enable;
    }
}

export class ColorTranslator {
    constructor() {
        this.colorsDict_ = {
            "transparent": { r: 0, g: 0, b: 0, a: 0 },
            "yellow": { r: 128, g: 0, b: 36, a: 255 }
        };
    }

    translate( /**@type string */color) {
        if (!color) {
            return this.colorsDict_.transparent;
        }
        color = color.trim().toLowerCase()
        if (this.colorsDict_[color]) {
            return this.colorsDict_[color];
        }
        if (!/^#[0-9a-f]+$/.test(color)) {
            return this.colorsDict_.transparent;
        }
        let colorLength = color.length > 4 ? 2 : 1;
        let scale = colorLength == 1 ? 0xF : 1;
        let idx = 1;
        let r = parseInt(color.slice(idx, idx + colorLength), 16) * scale || 0;
        idx += colorLength;
        let g = parseInt(color.slice(idx, idx + colorLength), 16) * scale || 0;
        idx += colorLength;
        let b = parseInt(color.slice(idx, idx + colorLength), 16) * scale || 0;
        idx += colorLength;
        let a = parseInt(color.slice(idx, idx + colorLength), 16) * scale || 255;
        this.colorsDict_[color] = { r, g, b, a };
        return this.colorsDict_[color];
    }
}

export class ImageLoader {
    load(url) {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.width = img.naturalWidth;
                ctx.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);
                resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
            }
            img.onerror = () => reject();
            img.src = url;
        })
    }
}

const ImageBodyProviderCache = {
    ppu: 0,
    data: new Map(),
}

export class ImageBodyProvider {
    constructor(width, height, imgRegion,/**@type ImageData */ imageData, animations) {
        this.width = width;
        this.height = height;
        this.imageData_ = imageData;
        this.animations_ = animations;
        this.theshod_ = 50;
        this.imgRegion_ = {
            left: imgRegion.left || 0,
            top: imgRegion.top || 0,
            width: imgRegion.width || this.imageData_.width,
            height: imgRegion.height || this.imageData_.height
        };
        this.nextFrame_;
    }

    bodyUpdated() {
        if (!this.animations_) {
            this.nextFrame_ = null;
            return false;
        }
        const frame = this.getFrame();
        this.bodyUpdated_ = frame != this.nextFrame_;
        this.nextFrame_ = frame;
        return this.bodyUpdated_;
    }

    getFrame() {
        if (!this.animations_) {
            return null;
        }
        const gbject = this.getGbject();
        const controller = gbject[AnimationController.name];
        if (!controller || !controller.animation || !controller.animation.frames) {
            return null;
        }
        return controller.animation.frames[controller.frame];
    }

    getImage_(imgData) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imgData.width;
        canvas.height = imgData.height;
        ctx.putImageData(imgData, 0, 0);
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    async getFrameImage_(frame, ppu) {
        const key = frame || this.imageData_;
        if (ImageBodyProviderCache.ppu != ppu) {
            ImageBodyProviderCache.ppu = ppu;
            ImageBodyProviderCache.data = new Map();
        }
        if (!ImageBodyProviderCache.data.has(key)) {
            let region = Object.assign({}, this.imgRegion_);
            if (frame) {
                region.top += frame[0] * region.height;
                region.left += frame[1] * region.width;
            }
            let imgData = new ImageData(Math.floor(this.width * ppu), Math.floor(this.height * ppu));
            let bitmaps = imgData.data;
            let toBitmaps = this.imageData_.data;
            let toHeight = Array.from({ length: imgData.height }, (_, j) => Math.floor(j * region.height / imgData.height) + region.top);
            let toWidth = Array.from({ length: imgData.width }, (_, i) => Math.floor(i * region.width / imgData.width) + region.left);
            for (let j = 0; j < imgData.height; j++) {
                for (let i = 0; i < imgData.width; i++) {
                    let idx = (j * imgData.width + i) * 4;
                    let toIdx = (toHeight[j] * this.imageData_.width + toWidth[i]) * 4;
                    if (toBitmaps[toIdx + 3] < this.theshod_) {
                        bitmaps[idx++] = 0;
                        bitmaps[idx++] = 0;
                        bitmaps[idx++] = 0;
                        bitmaps[idx++] = 0;
                    }
                    bitmaps[idx++] = toBitmaps[toIdx++];
                    bitmaps[idx++] = toBitmaps[toIdx++];
                    bitmaps[idx++] = toBitmaps[toIdx++];
                    bitmaps[idx++] = toBitmaps[toIdx++];
                }
            }
            ImageBodyProviderCache.data.set(key, this.getImage_(imgData))
        }
        return ImageBodyProviderCache.data.get(key);
    }

    async provide(_, { x, y, width, height }, { getDrawX, getDrawY }, addRendered, ppu) {
        const img = await this.getFrameImage_(this.nextFrame_, ppu);
        addRendered((/**@type CanvasRenderingContext2D*/ctx) => {
            const startX = getDrawX(0);
            const startY = getDrawY(0);
            const imgWidth = getDrawX(x + width) - startX;
            const imgHeight = getDrawY(y + height) - startY;
            ctx.drawImage(img, img.width - imgWidth, img.height - imgHeight, imgWidth, imgHeight, startX, startY, imgWidth, imgHeight);
        });
    }
}

export class ColorBodyProvider {
    constructor(width, height, { r, g, b, a }) {
        this.width = width;
        this.height = height;
        this.r_ = r;
        this.g_ = g;
        this.b_ = b;
        this.a_ = a;
        this.bodyUpdated_ = false;
    }

    bodyUpdated() {
        return this.bodyUpdated_;
    }
    provide(imgData, { x, y, width, height }, { getDrawX, getDrawY }) {
        let dx = getDrawX(x);
        let dy = getDrawY(y);
        let imgWidth = getDrawX(x + width) - dx;
        let imgHeight = getDrawY(y + height) - dy;
        let bitmaps = imgData.data;
        for (let j = 0; j < imgHeight; j++) {
            for (let i = 0; i < imgWidth; i++) {
                let idx = ((j + dy) * imgData.width + i + dx) * 4;
                bitmaps[idx++] = this.r_;
                bitmaps[idx++] = this.g_;
                bitmaps[idx++] = this.b_;
                bitmaps[idx++] = this.a_;
            }
        }
        this.bodyUpdated_ = false;
    }
}

export class TextBodyProvider {
    constructor(width, height, text, style) {
        this.width = width;
        this.height = height;
        this.style_ = style;
        this.text_ = text;
        this.bodyUpdated_ = false;
    }
    bodyUpdated() {
        return this.bodyUpdated_;
    }
    provide(imgData, { x, y, width, height }, { getDrawX, getDrawY }, addRendered) {
        let dx = getDrawX(x);
        let dy = getDrawY(y);
        let imgWidth = getDrawX(x + width) - dx;
        let imgHeight = getDrawY(y + height) - dy;
        addRendered((/**@type CanvasRenderingContext2D*/ctx) => {
            let fontCount = Math.floor(imgWidth * this.width / width / this.text_.length);
            ctx.font = `${fontCount}px serif`;
            ctx.fillStyle = this.style_;
            ctx.textBaseline = "top"
            ctx.fillText(this.text_, dx - x * imgWidth / width, dy - y * imgHeight / height);
        })
        this.bodyUpdated_ = false;
    }
}

export class MapBodyProvider {
    constructor(width, height, data, scale = 1) {
        this.dataWidth = width;
        this.dataHeight = height;
        this.data_ = data;
        this.scale_ = scale;
        this.width = this.dataWidth * this.scale_;
        this.height = this.dataHeight * this.scale_;
        this.bodyUpdated_ = false;
    }
    bodyUpdated() {
        return this.bodyUpdated_;
    }
    provide(imgData, { x, y, width, height }, { getDrawX, getDrawY }, _, ppu) {
        let dx = getDrawX(x);
        let dy = getDrawY(y);
        let imgWidth = getDrawX(x + width) - dx;
        let imgHeight = getDrawY(y + height) - dy;
        let bitmaps = imgData.data;
        for (let j = 0; j < imgHeight; j++) {
            for (let i = 0; i < imgWidth; i++) {
                let idx = ((j + dy) * imgData.width + i + dx) * 4;
                let mapI = Math.floor((x + i / ppu) / this.scale_);
                let mapJ = Math.floor((y + j / ppu) / this.scale_);
                let mapItem = this.data_[this.dataWidth * mapJ + mapI];
                if (mapItem == null) {
                    continue;
                }
                bitmaps[idx++] = mapItem.r;
                bitmaps[idx++] = mapItem.g;
                bitmaps[idx++] = mapItem.b;
                bitmaps[idx++] = mapItem.a;
            }
        }
        this.bodyUpdated_ = false;
    }
}

export class Body extends Component {
    constructor(provider) {
        super();
        this.size = new Vector2(provider.width, provider.height);
        this.updateImageData = provider.provide.bind(provider);
        this.bodyUpdated = provider.bodyUpdated.bind(provider);
        provider.getGbject = () => this.gbject;
    }
}

export class Controller extends Component {
    constructor(handlers) {
        super();
        Object.assign(this, handlers);
    }
}

export class Walker extends Component {
    constructor(/**@type */ speed = 1, /**@boolean */useViewLimit = false) {
        super();
        this.speed = speed;
        /**@type Vector2[] */
        this.stepPoints_ = [];
        this.useViewLimit_ = useViewLimit;
    }

    walkTo(/**@type Vector2 */ ...loc) {
        if (!this.targets_) {
            this.targets_ = loc;
            this.stepPoints_ = [];
        } else {
            this.nextTargets_ = loc;
        }
    }

    walkStep_(/**@type GameContext */ctx) {
        const self = this.gbject;
        let s = this.speed * (ctx.current - ctx.last) / 1000;
        /**@type Vector2 */
        let pos = self.position;
        let next = this.stepPoints_[0]
        let dist = pos.distanceFrom(next);
        const opt = s / dist;
        if (opt > 1) {
            self.position = next;
            self.positionUpdated = true;
            if (this.nextTargets_) {
                this.targets_ = this.nextTargets_;
                this.nextTargets_ = null;
                this.stepPoints_ = [];
            } else {
                this.stepPoints_.shift()
                if (!this.stepPoints_.length) {
                    this.targets_ = null;
                }
            }
            return;
        }
        pos.x += (next.x - pos.x) * opt;
        pos.y += (next.y - pos.y) * opt;
        self.positionUpdated = true;
    }

    findStepPoints_(/**@type GameContext */ctx) {
        if (!this.gbject[Rigid.name]) {
            this.stepPoints_ = [this.targets_];
            return;
        }
        const { sIdx, sIdy, tIds, cWidth, cHeight, width, height, matrix }
            = ctx.getAdjData(this.gbject, this.targets_, this.useViewLimit_);
        const allSet = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                allSet.push({ x, y })
            }
        }
        const start = allSet[sIdx + sIdy * width];
        const goals = new Set(tIds.map(({ tIdx, tIdy }) => allSet[tIdx + tIdy * width])
            .filter(g => g));
        const openSet = new Set([start]);
        const closedSet = new Set();
        const traces = new Map();
        const scores = new Map();
        scores.set(start, Math.max(...Array.from(goals.keys()).map(goal => this.distance_(start, goal))));
        let path;
        while (openSet.size) {
            let minScore = Number.MAX_VALUE;
            let current;
            for (let p of openSet) {
                let pScore = scores.get(p);
                if (pScore < minScore) {
                    minScore = pScore;
                    current = p;
                }
            }
            if (goals.has(current)) {
                path = [];
                this.buildPath_(traces, current, path);
                break;
            }
            if (!current) {
                break;
            }
            openSet.delete(current);
            closedSet.add(current);
            const neighbors = [
                { x: current.x - 1, y: current.y },
                { x: current.x + 1, y: current.y },
                { x: current.x, y: current.y - 1 },
                { x: current.x, y: current.y + 1 }
            ]
                .filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height && !matrix[x + y * width])
                .map(n => allSet[n.x + n.y * width]);
            for (let next of neighbors) {
                if (closedSet.has(next)) {
                    continue;
                }
                if (next == undefined) {
                    debugger;
                }
                let yScore = scores.get(current) + this.distance_(current, next);
                if (!openSet.has(next) || yScore < scores.get(next)) {
                    traces.set(next, current);
                    scores.set(next, yScore);
                    openSet.add(next);
                }
            }
        }
        if (!path || !path.length) {
            this.targets_ = null;
        } else {
            // let str = '';
            // for (let j = 0; j < height; j++) {
            //     for (let i = 0; i < width; i++) {
            //         str += matrix[j * width + i];
            //     }
            //     str += '\n'
            // }
            // console.log(str, path);
            const pos = this.gbject.position;
            this.stepPoints_ = path.map(({ x, y }) =>
                new Vector2((x - sIdx) * cWidth + pos.x, (y - sIdy) * cHeight + pos.y)
            );
        }
    }

    buildPath_(traces, current, path) {
        if (traces.has(current)) {
            path.unshift(current);
            this.buildPath_(traces, traces.get(current), path);
        }
    }


    distance_(p1, p2) {
        if (p2 == undefined) {
            debugger;
        }
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    onframe(/**@type GameContext */ctx) {
        if (this.targets_ && this.stepPoints_.length) {
            this.walkStep_(ctx);
            return;
        }
        if (this.targets_ && !this.stepPoints_.length) {
            this.findStepPoints_(ctx);
            return;
        }
    }
}

export class Session {
    constructor() {
        /**@type Gbject[] */
        this.gbjects = [];
    }
}

export class GameContext {
    constructor() {
        this.last = 0;
        this.current = 0;
        /**@type Gbject[] */
        this.rigids_ = [];
    }

    mathSide_(value) {
        return value > 0 ? Math.ceil(value) : Math.floor(value);
    }

    getAdjData(/**@type Gbject*/gbj, /**@type Vector2[] */ targets, /**@type boolean */ limitInCamera, cellDevide = 0) {
        const source = gbj.position;
        const sourceSize = gbj[Rigid.name].size;
        let left, top, right, bottom;
        if (limitInCamera) {
            left = this.wxmin;
            right = this.wxmax;
            top = this.wymin;
            bottom = this.wymax;
        }
        else {
            left = Math.min(source.x - sourceSize.x / 2, ...targets.map(t => t.x));
            right = Math.max(source.x + sourceSize.x / 2, ...targets.map(t => t.x));
            top = Math.min(source.y - sourceSize.y / 2, ...targets.map(t => t.y));
            bottom = Math.max(source.y + sourceSize.y / 2, ...targets.map(t => t.y));
        }
        const cWidth = sourceSize.x / (2 * cellDevide + 1);
        const cHeight = sourceSize.y / (2 * cellDevide + 1);
        left += (source.x - sourceSize.x / 2 - left) % cWidth - cWidth;
        top += (source.y - sourceSize.y / 2 - top) % cHeight - cHeight;
        const width = Math.floor((right - left) / cWidth);
        const height = Math.floor((bottom - top) / cHeight);
        const sIdx = Math.floor((source.x - left) / cWidth);
        const sIdy = Math.floor((source.y - top) / cHeight);
        const tIds = targets.map(target => {
            const tIdx = Math.floor((target.x - left) / cWidth);
            const tIdy = Math.floor((target.y - top) / cHeight);
            const fixX = (target.x - left - tIdx * cWidth);
            const fixY = (target.y - top - tIdy * cHeight);
            return { tIdx, tIdy, fixX, fixY }
        })
        const rigidMatrix = Array.from({ length: width * height }, () => 0);
        for (const r of this.rigids_) {
            if (r === gbj) {
                continue;
            }
            const rSize = r[Rigid.name].size;
            const rPos = r.position;
            const rLeft = Math.floor((rPos.x - rSize.x / 2 - left) / cWidth);
            const rRight = Math.floor((rPos.x + rSize.x / 2 - left) / cWidth) - ((rPos.x + rSize.x / 2 - left) % cWidth < Number.EPSILON ? 1 : 0);
            const rTop = Math.floor((rPos.y - rSize.y / 2 - top) / cHeight);
            const rBottom = Math.floor((rPos.y + rSize.y / 2 - top) / cHeight) - ((rPos.y + rSize.y / 2 - top) % cHeight < Number.EPSILON ? 1 : 0);
            for (let j = Math.max(rTop, 0); j <= Math.min(rBottom, height - 1); j++) {
                for (let i = Math.max(rLeft, 0); i <= Math.min(rRight, width - 1); i++) {
                    rigidMatrix[j * width + i] = 1;
                }
            }
        }
        let matrix = rigidMatrix;
        if (cellDevide != 0) {
            matrix = Array.from({ length: width * height }, () => 1);
            for (let j = cellDevide; j < height - cellDevide; j++) {
                for (let i = cellDevide; i < width - cellDevide; i++) {
                    let has = false;
                    for (let n = j - cellDevide; n <= j + cellDevide; n++) {
                        for (let m = i - cellDevide; m <= i + cellDevide; m++) {
                            if (rigidMatrix[n * width + m]) {
                                has = 1;
                                break;
                            }
                        }
                        if (has) {
                            break;
                        }
                    }
                    matrix[j * width + i] = has;
                }
            }
        }

        return { sIdx, sIdy, tIds, cWidth, cHeight, width, height, matrix };
    }
}

export const sleep = (/**@type number */timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export class Game {
    constructor(/**@type HTMLElement */ root, { canvasWidth, fps }) {
        this.root_ = root;
        this.context_ = new GameContext();
        this.context_.state = GameStatus.Stop;
        this.canvas_ = document.createElement("canvas");
        this.canvas_.classList.add("main-canvas")
        this.canvas_.addEventListener("click", (e) => this.onCanvasClick_(e));
        this.root_.appendChild(this.canvas_);
        this.fps_ = fps * 1 || 60;
        this.maxCanvasWidth_ = canvasWidth * 1 || Number.MAX_VALUE;
        this.frameLength_ = 1000 / this.fps_;
    }

    getWordLocation_(/**@type number*/ screenX,/**@type number*/ screenY) {
        const ppu = this.context_.ppu;
        const x = (screenX - this.canvas_.width / 2) / ppu + this.context_.currentCamera.position.x;
        const y = (screenY - this.canvas_.height / 2) / ppu + this.context_.currentCamera.position.y;
        return new Vector2(x, y);
    }

    async forEachComponents_(func) {
        for (const g of this.session_.gbjects) {
            if (!g.enabled) {
                continue;
            }
            for (const c of g.components) {
                await func(c);
            }
        }
    }

    onCanvasClick_(/**@type MouseEvent */e) {
        if (this.context_.state != GameStatus.Run || !this.context_.currentCamera) {
            return;
        }
        const loc = this.getWordLocation_(e.x * this.context_.canvasScale, e.y * this.context_.canvasScale);
        this.forEachComponents_((c) => {
            c.onclick && c.onclick(loc);
        });
    }

    pause() {
        this.context_.state = GameStatus.Pause;
    }

    resume() {
        this.context_.state = GameStatus.Resume;
    }

    stop() {
        this.context_.state = GameStatus.Stop;
    }

    async start(/**@type Session */session) {
        this.session_ = session;
        this.context_.state = GameStatus.Run;
        this.context_.last = 0;
        while (this.context_.state != GameStatus.Stop) {
            this.context_.current = Date.now();
            const remain = this.frameLength_ - (this.context_.current - this.context_.last);
            if (remain > 0) {
                await sleep(remain);
            }
            try {
                this.context_.current = Date.now();
                if (this.context_.state != GameStatus.Run) {
                    continue;
                }
                await this.updateGbjects_();
                await this.updateRigids_();
                await this.render_();
            } finally {
                this.context_.last = this.context_.current;
            }
        }
        this.root_.removeChild(this.canvas_);
    }

    async updateRigids_() {
        this.context_.rigids_ = [];
        for (const g of this.session_.gbjects) {
            if (g.enabled && g[Rigid.name]) {
                this.context_.rigids_.push(g);
            }
        }
    }

    async updateGbjects_() {
        await this.forEachComponents_(async (c) => c.onframe && await c.onframe(this.context_));
    }

    async render_() {
        let camera = this.session_.gbjects.find(g => g.enabled && g[Camera.name] && g[Camera.name].enable);
        if (!camera) {
            return;
        }
        this.context_.currentCamera = camera;
        const canvasOpt = this.root_.clientWidth / this.root_.clientHeight;
        const nextCanvasWidth = Math.floor(Math.min(this.root_.clientWidth, this.maxCanvasWidth_));
        if (!nextCanvasWidth) {
            return
        }
        const nextCanvasHeight = Math.floor(nextCanvasWidth / canvasOpt);
        if (this.canvas_.width != nextCanvasWidth) {
            this.canvas_.width = nextCanvasWidth;
        }
        if (this.canvas_.height != nextCanvasHeight) {
            this.canvas_.height = nextCanvasHeight;
        }
        this.context_.canvasScale = this.canvas_.width / this.root_.clientWidth;
        const ctx = this.canvas_.getContext('2d');
        this.context_.ppu = this.context_.currentCamera[Camera.name].ppu;
        const wwidth = this.canvas_.width / this.context_.ppu;
        const wheight = this.canvas_.height / this.context_.ppu;
        this.context_.wxmax = this.context_.currentCamera.position.x + wwidth / 2;
        this.context_.wxmin = this.context_.currentCamera.position.x - wwidth / 2;
        this.context_.wymax = this.context_.currentCamera.position.y + wheight / 2;
        this.context_.wymin = this.context_.currentCamera.position.y - wheight / 2;
        let needUpdate = !!this.context_.currentCamera.positionUpdated;
        if (!this.imgDataCache_ || this.canvas_.width != this.imgDataCache_.width
            || this.canvas_.height != this.imgDataCache_.height) {
            needUpdate = true;
        }

        for (const gbj of this.session_.gbjects) {
            if (!gbj.enabled) {
                continue;
            }
            let body = gbj[Body.name]
            if (!body) {
                continue;
            }
            if (body.bodyUpdated() || gbj.positionUpdated) {
                needUpdate = true;
            }
        }
        if (needUpdate) {
            let rendereds = [];
            const addRendered = (func) => func && rendereds.push(func);
            this.imgDataCache_ = new ImageData(this.canvas_.width, this.canvas_.height);
            for (const gbj of this.session_.gbjects) {
                if (!gbj.enabled) {
                    continue;
                }
                let body = gbj[Body.name]
                if (!body) {
                    continue;
                }
                gbj.positionUpdated = false;
                await this.updateBodyImage_(gbj, this.context_.ppu, this.context_.wxmax, this.context_.wxmin, this.context_.wymax, this.context_.wymin, addRendered);
            }
            this.context_.currentCamera.positionUpdated = false;
            // ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
            ctx.putImageData(this.imgDataCache_, 0, 0);
            if (rendereds && rendereds.length) {
                for (const r of rendereds) {
                    await r(ctx)
                }
            }
        }
    }

    async updateBodyImage_(
        /**@type Gbject */ body,
        /**@type number */ ppu,
        /**@type number */ wxmax,
        /**@type number */ wxmin,
        /**@type number */ wymax,
        /**@type number */ wymin,
        addRendered) {
        const ex = body.position.x;
        const ey = body.position.y;
        const esx = body[Body.name].size.x;
        const esy = body[Body.name].size.y;
        const dxmin = Math.max(wxmin, ex - esx / 2);
        const dxmax = Math.min(wxmax, ex + esx / 2);
        const dwidth = dxmax - dxmin;
        if (dwidth < 0) {
            return;
        }
        const dymin = Math.max(wymin, ey - esy / 2);
        const dymax = Math.min(wymax, ey + esy / 2);
        const dheight = dymax - dymin;
        if (dheight < 0) {
            return;
        }
        const local = { x: (dxmin - ex) + esx / 2, y: (dymin - ey) + esy / 2, width: dwidth, height: dheight };
        const getDrawX = (x) => Math.floor((x - esx / 2 + ex - this.context_.currentCamera.position.x) * ppu + this.canvas_.width / 2)
        const getDrawY = (y) => Math.floor((y - esy / 2 + ey - this.context_.currentCamera.position.y) * ppu + this.canvas_.height / 2)
        let dx = getDrawX(local.x);
        let dy = getDrawY(local.y);
        let imgWidth = getDrawX(local.x + local.width) - dx;
        let imgHeight = getDrawY(local.y + local.height) - dy;
        if (imgWidth <= 0 || imgHeight <= 0) {
            return;
        }
        await body[Body.name].updateImageData(this.imgDataCache_, local, { getDrawX, getDrawY }, addRendered, ppu);
    }
}