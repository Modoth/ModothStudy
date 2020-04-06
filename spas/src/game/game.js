const GameStatus = {
    Stop: 0,
    Run: 1,
    Pause: 2
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

export class Rigid extends Component {
    constructor(width = 1, height = 1) {
        super();
        this.size = new Vector2(width, height);
    }
}

export class Camera extends Component {
    constructor(/**@type number */viewSize, /**@type boolean */enable) {
        super();
        this.viewSize = viewSize * 1;
        this.enable = enable;
    }
}

export class ColorTranslator {
    constructor() {
        this.mColorsDict = {
            "transparent": { r: 0, g: 0, b: 0, a: 0 },
            "yellow": { r: 128, g: 0, b: 36, a: 255 }
        };
    }

    translate( /**@type string */color) {
        if (!color) {
            return this.mColorsDict.transparent;
        }
        color = color.trim().toLowerCase()
        if (this.mColorsDict[color]) {
            return this.mColorsDict[color];
        }
        if (!/^#[0-9a-f]+$/.test(color)) {
            return this.mColorsDict.transparent;
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
        this.mColorsDict[color] = { r, g, b, a };
        return this.mColorsDict[color];
    }
}

export class ColorBodyProvider {
    constructor(width, height, { r, g, b, a }) {

        this.width = width;
        this.height = height;
        this.mR = r;
        this.mG = g;
        this.mB = b;
        this.mA = a;
        this.mBodyUpdated = false;
    }

    bodyUpdated() {
        return this.mBodyUpdated;
    }
    provide(imgData, x, y, width, height, dx, dy, imgWidth, imgHeight) {
        let bitmaps = imgData.data;
        for (let j = 0; j < imgHeight; j++) {
            for (let i = 0; i < imgWidth; i++) {
                let idx = ((j + dy) * imgData.width + i + dx) * 4;
                bitmaps[idx++] = this.mR;
                bitmaps[idx++] = this.mG;
                bitmaps[idx++] = this.mB;
                bitmaps[idx++] = this.mA;
            }
        }
        this.mBodyUpdated = false;
    }
}

export class TextBodyProvider {
    constructor(width, height, text, style) {
        this.width = width;
        this.height = height;
        this.mStyle = style;
        this.mText = text;
        this.mBodyUpdated = false;
    }
    bodyUpdated() {
        return this.mBodyUpdated;
    }
    provide(imgData, x, y, width, height, dx, dy, imgWidth, imgHeight, addRendered) {
        addRendered((/**@type CanvasRenderingContext2D*/ctx) => {
            let fontCount = Math.floor(imgWidth * this.width / width / this.mText.length);
            ctx.font = `${fontCount}px serif`;
            ctx.fillStyle = this.mStyle;
            ctx.textBaseline = "top"
            ctx.fillText(this.mText, dx - x * imgWidth / width, dy - y * imgHeight / height);
        })
        this.mBodyUpdated = false;
    }
}

export class MapBodyProvider {
    constructor(width, height, data, scale = 1) {
        this.dataWidth = width;
        this.dataHeight = height;
        this.mData = data;
        this.mScale = scale;
        this.width = this.dataWidth * this.mScale;
        this.height = this.dataHeight * this.mScale;
        this.mBodyUpdated = false;
    }
    bodyUpdated() {
        return this.mBodyUpdated;
    }
    provide(imgData, x, y, width, height, dx, dy, imgWidth, imgHeight) {
        let bitmaps = imgData.data;
        for (let j = 0; j < imgHeight; j++) {
            for (let i = 0; i < imgWidth; i++) {
                let idx = ((j + dy) * imgData.width + i + dx) * 4;
                let mapI = Math.floor((x + width * i / imgWidth) / this.mScale);
                let mapJ = Math.floor((y + height * j / imgHeight) / this.mScale);
                let mapItem = this.mData[this.dataWidth * mapJ + mapI];
                bitmaps[idx++] = mapItem.r;
                bitmaps[idx++] = mapItem.g;
                bitmaps[idx++] = mapItem.b;
                bitmaps[idx++] = mapItem.a;
            }
        }
        this.mBodyUpdated = false;
    }
}

export class Body extends Component {
    constructor(provider) {
        super();
        this.size = new Vector2(provider.width, provider.height);
        this.updateImageData = provider.provide.bind(provider);
        this.bodyUpdated = provider.bodyUpdated.bind(provider);
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
        this.mStepPoints = [];
        this.mUseViewLimit = useViewLimit;
    }

    walkTo(/**@type Vector2 */ loc) {
        if (!this.mTarget) {
            this.mTarget = loc;
            this.mStepPoints = [];
        } else {
            this.mNextTarget = loc;
        }
    }

    mWalkStep(/**@type GameContext */ctx) {
        const self = this.gbject;
        let s = this.speed * (ctx.current - ctx.last) / 1000;
        /**@type Vector2 */
        let pos = self.position;
        let next = this.mStepPoints[0]
        let dist = pos.distanceFrom(next);
        const opt = s / dist;
        if (opt > 1) {
            self.position = next;
            self.positionUpdated = true;
            if (this.mNextTarget) {
                this.mTarget = this.mNextTarget;
                this.mNextTarget = null;
                this.mStepPoints = [];
            } else {
                this.mStepPoints.shift()
                if (!this.mStepPoints.length) {
                    this.mTarget = null;
                }
            }
            return;
        }
        pos.x += (next.x - pos.x) * opt;
        pos.y += (next.y - pos.y) * opt;
        self.positionUpdated = true;
    }

    mFindStepPoints(/**@type GameContext */ctx) {
        if (!this.gbject[Rigid.name]) {
            this.mStepPoints = [this.mTarget];
            return;
        }
        const { sIdx, sIdy, tIdx, tIdy, fixX, fixY, cWidth, cHeight, width, height, matrix }
            = ctx.getAdjData(this.gbject, this.mTarget, this.mUseViewLimit);
        const allSet = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                allSet.push({ x, y })
            }
        }
        const start = allSet[sIdx + sIdy * width];
        const goal = allSet[tIdx + tIdy * width];
        const openSet = new Set([start]);
        const closedSet = new Set();
        const traces = new Map();
        const scores = new Map();
        scores.set(start, this.mDistance(start, goal));
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
            if (current == goal) {
                path = [];
                this.mBuildPath(traces, goal, path);
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
                let yScore = scores.get(current) + this.mDistance(current, next);
                if (!openSet.has(next) || yScore < scores.get(next)) {
                    traces.set(next, current);
                    scores.set(next, yScore);
                    openSet.add(next);
                }
            }
        }
        if (!path || !path.length) {
            this.mTarget = null;
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
            this.mStepPoints = path.map(({ x, y }) =>
                new Vector2((x - sIdx) * cWidth + pos.x, (y - sIdy) * cHeight + pos.y)
            );
        }
    }

    mBuildPath(traces, current, path) {
        if (traces.has(current)) {
            path.unshift(current);
            this.mBuildPath(traces, traces.get(current), path);
        }
    }


    mDistance(p1, p2) {
        if (p2 == undefined) {
            debugger;
        }
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    onframe(/**@type GameContext */ctx) {
        if (this.mTarget && this.mStepPoints.length) {
            this.mWalkStep(ctx);
            return;
        }
        if (this.mTarget && !this.mStepPoints.length) {
            this.mFindStepPoints(ctx);
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
        this.mRigids = [];
    }

    mMathSide(value) {
        return value > 0 ? Math.ceil(value) : Math.floor(value);
    }

    getAdjData(/**@type Gbject*/gbj, /**@type Vector2 */ target, /**@type boolean */ limitInCamera, cellDevide = 0) {
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
            left = Math.min(source.x - sourceSize.x / 2, target.x);
            right = Math.max(source.x + sourceSize.x / 2, target.x);
            top = Math.min(source.y - sourceSize.y / 2, target.y);
            bottom = Math.max(source.y + sourceSize.y / 2, target.y);
        }
        const cWidth = sourceSize.x / (2 * cellDevide + 1);
        const cHeight = sourceSize.y / (2 * cellDevide + 1);
        left += (source.x - sourceSize.x / 2 - left) % cWidth - cWidth;
        top += (source.y - sourceSize.y / 2 - top) % cHeight - cHeight;
        const width = Math.floor((right - left) / cWidth);
        const height = Math.floor((bottom - top) / cHeight);
        const sIdx = Math.floor((source.x - left) / cWidth);
        const sIdy = Math.floor((source.y - top) / cHeight);
        const tIdx = Math.floor((target.x - left) / cWidth);
        const tIdy = Math.floor((target.y - top) / cHeight);
        const fixX = (target.x - left - tIdx * cWidth);
        const fixY = (target.y - top - tIdy * cHeight);
        const rigidMatrix = Array.from({ length: width * height }, () => 0);
        for (const r of this.mRigids) {
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

        return { sIdx, sIdy, tIdx, tIdy, fixX, fixY, cWidth, cHeight, width, height, matrix };
    }
}

export class Game {
    constructor(/**@type HTMLElement */ root, { canvasWidth, fps }) {
        this.mRoot = root;
        this.mContext = new GameContext();
        this.mContext.state = GameStatus.Stop;
        this.mCanvas = document.createElement("canvas");
        this.mCanvas.classList.add("main-canvas")
        this.mCanvas.addEventListener("click", (e) => this.mOnCanvasClick(e));
        this.mRoot.appendChild(this.mCanvas);
        this.mFps = fps * 1 || 60;
        this.mMaxCanvasWidth = canvasWidth * 1 || Number.MAX_VALUE;
        this.mFrameLength = 1000 / this.mFps;
    }

    mGetWordLocation(/**@type number*/ screenX,/**@type number*/ screenY) {
        const ppu = this.mContext.ppu;
        const x = (screenX - this.mCanvas.width / 2) / ppu + this.mContext.currentCamera.position.x;
        const y = (screenY - this.mCanvas.height / 2) / ppu + this.mContext.currentCamera.position.y;
        return new Vector2(x, y);
    }

    async mForEachComponents(func) {
        for (const g of this.mSession.gbjects) {
            if (!g.enabled) {
                continue;
            }
            for (const c of g.components) {
                await func(c);
            }
        }
    }

    mOnCanvasClick(/**@type MouseEvent */e) {
        if (this.mContext.state != GameStatus.Run || !this.mContext.currentCamera) {
            return;
        }
        const loc = this.mGetWordLocation(e.x * this.mContext.canvasScale, e.y * this.mContext.canvasScale);
        this.mForEachComponents((c) => {
            c.onclick && c.onclick(loc);
        });
    }

    async mSleep(/**@type number */timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    stop() {
        this.mContext.state = GameStatus.Stop;
    }

    async start(/**@type Session */session) {
        this.mSession = session;
        this.mContext.state = GameStatus.Run;
        this.mContext.last = 0;
        while (this.mContext.state != GameStatus.Stop) {
            this.mContext.current = Date.now();
            const remain = this.mFrameLength - (this.mContext.current - this.mContext.last);
            if (remain > 0) {
                await this.mSleep(remain);
            }
            try {
                this.mContext.current = Date.now();
                await this.mUpdateGbjects();
                await this.mUpdateRigids();
                await this.mRender();
            } finally {
                this.mContext.last = this.mContext.current;
            }
        }
        this.mRoot.removeChild(this.mCanvas);
    }

    async mUpdateRigids() {
        this.mContext.mRigids = [];
        for (const g of this.mSession.gbjects) {
            if (g.enabled && g[Rigid.name]) {
                this.mContext.mRigids.push(g);
            }
        }
    }

    async mUpdateGbjects() {
        await this.mForEachComponents(async (c) => c.onframe && await c.onframe(this.mContext));
    }

    async mRender() {
        let camera = this.mSession.gbjects.find(g => g.enabled && g[Camera.name] && g[Camera.name].enable);
        if (!camera) {
            return;
        }
        this.mContext.currentCamera = camera;
        const canvasOpt = this.mRoot.clientWidth / this.mRoot.clientHeight;
        const nextCanvasWidth = Math.floor(Math.min(this.mRoot.clientWidth, this.mMaxCanvasWidth));
        if(!nextCanvasWidth){
            return
        }
        const nextCanvasHeight = Math.floor(nextCanvasWidth / canvasOpt);
        if (this.mCanvas.width != nextCanvasWidth) {
            this.mCanvas.width = nextCanvasWidth;
        }
        if (this.mCanvas.height != nextCanvasHeight) {
            this.mCanvas.height = nextCanvasHeight;
        }
        this.mContext.canvasScale = this.mCanvas.width / this.mRoot.clientWidth;
        const ctx = this.mCanvas.getContext('2d');
        const viewSize = this.mContext.currentCamera[Camera.name].viewSize;
        let wwidth, wheight
        if (this.mCanvas.width > this.mCanvas.height) {
            wheight = viewSize;
            this.mContext.ppu = this.mCanvas.height / wheight;
            wwidth = this.mCanvas.width / this.mContext.ppu;
        }
        else {
            wwidth = viewSize;
            this.mContext.ppu = this.mCanvas.width / wwidth;
            wheight = this.mCanvas.height / this.mContext.ppu;
        }
        this.mContext.wxmax = this.mContext.currentCamera.position.x + wwidth / 2;
        this.mContext.wxmin = this.mContext.currentCamera.position.x - wwidth / 2;
        this.mContext.wymax = this.mContext.currentCamera.position.y + wheight / 2;
        this.mContext.wymin = this.mContext.currentCamera.position.y - wheight / 2;
        let needUpdate = !!this.mContext.currentCamera.positionUpdated;
        if (!this.mImgDataCache || this.mCanvas.width != this.mImgDataCache.width
            || this.mCanvas.height != this.mImgDataCache.height) {
            needUpdate = true;
        }

        for (const gbj of this.mSession.gbjects) {
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
            this.mImgDataCache = new ImageData(this.mCanvas.width, this.mCanvas.height);
            for (const gbj of this.mSession.gbjects) {
                if (!gbj.enabled) {
                    continue;
                }
                let body = gbj[Body.name]
                if (!body) {
                    continue;
                }
                gbj.positionUpdated = false;
                await this.mUpdateBodyImage(gbj, this.mContext.ppu, this.mContext.wxmax, this.mContext.wxmin, this.mContext.wymax, this.mContext.wymin, addRendered);
            }
            this.mContext.currentCamera.positionUpdated = false;
            // ctx.clearRect(0, 0, this.mCanvas.width, this.mCanvas.height);
            ctx.putImageData(this.mImgDataCache, 0, 0);
            if (rendereds && rendereds.length) {
                rendereds.forEach(r => r(ctx));
            }
        }
    }

    async mUpdateBodyImage(
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

        let dx = Math.floor((dxmin - this.mContext.currentCamera.position.x) * ppu + this.mCanvas.width / 2);
        let dy = Math.floor((dymin - this.mContext.currentCamera.position.y) * ppu + this.mCanvas.height / 2);
        let width = Math.floor((dxmax - this.mContext.currentCamera.position.x) * ppu + this.mCanvas.width / 2) - dx;
        let height = Math.floor((dymax - this.mContext.currentCamera.position.y) * ppu + this.mCanvas.height / 2) - dy;
        if (width <= 0 || height <= 0) {
            return;
        }
        body[Body.name].updateImageData(this.mImgDataCache, (dxmin - ex) + esx / 2, (dymin - ey) + esy / 2, dwidth, dheight, dx, dy, width, height, addRendered);
    }
}