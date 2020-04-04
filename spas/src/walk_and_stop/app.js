import { Modal } from '../modal/index.js'
import { Game, Camera, Gbject, Rigid, Body, Session, Walker, Controller, ColorBodyProvider, MapBodyProvider, TextBodyProvider, ColorTranslator, GameContext } from '../game/game.js'
import { MapEditor } from './mapEditor.js';
import { Config } from './config.js';

export class App {
    constructor(/**@type HTMLElement */ root, appData) {
        this.mRoot = root;
        this.mAppData = appData || new Config().appData;
        this.mModal = new Modal();
        this.colorTranslator = new ColorTranslator();
    }

    async mRunSession(sessionData, options) {
        let mapHeight = sessionData.cells.length;
        if (!mapHeight) {
            return;
        }
        let mapWidth = sessionData.cells[0].length;
        if (!mapWidth) {
            return;
        }
        let mapScale = sessionData.scale || 1;
        let mapData = [];
        let cellColors = sessionData.cellTypes.map(t => this.colorTranslator.translate(t.color));
        let transParent = { r: 0, g: 0, b: 0, a: 0 };
        sessionData.cellTypes.forEach(t => t.rgba = this.colorTranslator.translate(t.color));
        for (let j = 0; j < mapHeight; j++) {
            for (let i = 0; i < mapWidth; i++) {
                let typeIdx = sessionData.cells[j][i] >>> 0;
                let type = sessionData.cellTypes[typeIdx];
                if (!type) {
                    mapData.push(transParent)
                    continue;
                }
                if (type.rigid) {
                    mapData.push(transParent)
                }
                else {
                    mapData.push(cellColors[typeIdx])
                }
            }
        }
        let map = new Gbject("map", new Body(new MapBodyProvider(mapWidth, mapHeight, mapData, mapScale)));
        map.position.x = (mapWidth - 1) * mapScale / 2;
        map.position.y = (mapHeight - 1) * mapScale / 2;
        let objects = [];
        sessionData.objects.forEach(t => t.rgba = this.colorTranslator.translate(t.color));
        for (let c of sessionData.objects) {
            let cScale = c.scale || 1;
            let obj = new Gbject('',
                new Body(c.text ?
                    new TextBodyProvider(cScale, cScale, c.text, c.color) :
                    new ColorBodyProvider(cScale, cScale, c.rgba)),
                ...(c.rigid ? [new Rigid(cScale, cScale)] : [])
            );
            obj.position.x = c.pos[1] * mapScale;
            obj.position.y = c.pos[0] * mapScale;
            objects.push(obj);
        }
        let game = new Game(this.mRoot, options || {});
        let success = false;
        let player = objects[sessionData.start];
        let terminal = objects[sessionData.end];
        let session = new Session();
        let wallVisiableTable = new Map();
        let wallPool = new Map();
        for (let type of sessionData.cellTypes) {
            wallPool.set(type, []);
        }
        let captureWall = (type) => {
            let wall = wallPool.get(type).pop();
            if (!wall) {
                wall = new Gbject('',
                    new Body(
                        type.text ?
                            new TextBodyProvider(mapScale, mapScale, type.text, type.color) :
                            new ColorBodyProvider(mapScale, mapScale, type.rgba)
                    ),
                    new Rigid(mapScale, mapScale));
                wall.__wall_type__ = type;
                session.gbjects.push(wall);
            }
            else {
                wall.enabled = true;
            }
            return wall;
        }

        let releaseWall = (wall) => {
            wall.enabled = false;
            wallPool.get(wall.__wall_type__).push(wall);
        }
        let lastMapRegion = {};
        let lastRefreshLocTime = 0;
        let refreshLocRegion = 1000;
        let lastDist = 0;
        let display = document.getElementById('display');
        let direction = document.getElementById('direction');
        let distance = document.getElementById('distance');
        display.onclick = async () => {
            let tableEle = document.createElement("div");
            tableEle.classList.add('table')
            let startPos = sessionData.objects[sessionData.start].pos;
            let endPos = sessionData.objects[sessionData.end].pos;
            for (let j = 0; j < sessionData.cells.length; j++) {
                let row = sessionData.cells[j];
                let rowEle = document.createElement('div');
                rowEle.classList.add("row");
                tableEle.appendChild(rowEle);
                for (let i = 0; i < row.length; i++) {
                    let cell = row[i] * 1;
                    let cellEle = document.createElement('div');
                    cellEle.classList.add("cell");
                    cellEle.classList.add(`cell-${cell}`)
                    if (j == startPos[0] && i == startPos[1]) {
                        cellEle.classList.add(`cell-start`)
                    }
                    if (j == endPos[0] && i == endPos[1]) {
                        cellEle.classList.add(`cell-end`)
                    }
                    rowEle.appendChild(cellEle);
                }
            }
            await this.mModal.popup(tableEle);
        }
        distance.innerHTML = '';
        display.classList.remove("hiden")
        player.addComponents(
            new Walker(sessionData.objects[sessionData.start].speed || sessionData.viewSize / 2, true),
            new Camera(sessionData.viewSize, 1),
            new Controller({
                onclick: (loc) => player[Walker.name].walkTo(loc),
                onframe: async (/**@type GameContext */ ctx) => {
                    let dist = Math.hypot(terminal.position.x - player.position.x,
                        terminal.position.y - player.position.y) / mapScale
                    if (dist < 1) {
                        success = true;
                        display.classList.add("hiden")
                        game.stop();
                        return;
                    }
                    let now = Date.now();
                    if (now - lastRefreshLocTime > refreshLocRegion && lastDist != Math.floor(dist)) {
                        lastDist = Math.floor(dist);
                        lastRefreshLocTime = now;
                        let deg = Math.floor(Math.acos((terminal.position.x - player.position.x) / dist / mapScale) * 180 / Math.PI);
                        if (terminal.position.y < player.position.y) {
                            deg = 360 - deg;
                        }
                        direction.style.transform = `rotate(${deg}deg)`
                        distance.innerText = `终点: ${lastDist}`;
                    }
                    let mLeft = Math.max(Math.floor(ctx.wxmin / mapScale) - 1, 0);
                    let mRight = Math.min(Math.ceil(ctx.wxmax / mapScale) + 1, mapWidth - 1);
                    let mTop = Math.max(Math.floor(ctx.wymin / mapScale) - 1, 0);
                    let mBottom = Math.min(Math.ceil(ctx.wymax / mapScale) + 1, mapHeight - 1);
                    if (lastMapRegion.mLeft == mLeft && lastMapRegion.mRight == mRight
                        && lastMapRegion.mTop == mTop && lastMapRegion.mBottom == mBottom) {
                        return;
                    }
                    lastMapRegion = { mLeft, mRight, mTop, mBottom }
                    let nextWallVisiableTable = new Map();
                    for (let j = mTop; j <= mBottom; j++) {
                        for (let i = mLeft; i <= mRight; i++) {
                            let idx = j * mapWidth + i;
                            if (wallVisiableTable.has(idx)) {
                                nextWallVisiableTable.set(idx, wallVisiableTable.get(idx));
                                wallVisiableTable.delete(idx);
                            }
                            else {
                                let type = sessionData.cellTypes[sessionData.cells[j][i] >>> 0];
                                if (type.rigid) {
                                    let wall = captureWall(type)
                                    wall.position.x = i * mapScale;
                                    wall.position.y = j * mapScale;
                                    nextWallVisiableTable.set(idx, wall);
                                }

                            }
                        }
                    }
                    for (let p of wallVisiableTable) {
                        releaseWall(p[1])
                    }
                    wallVisiableTable = nextWallVisiableTable;
                }
            }));
        session.gbjects.push(map, ...objects);
        await game.start(session);
        return success;
    }

    async run() {
        const style = document.getElementById("styleBackground");
        let sessionIdx = 0;
        while (this.mAppData.sessions && this.mAppData.sessions[0].cells) {
            while (this.mAppData.sessions && this.mAppData.sessions[sessionIdx]) {
                await this.mModal.toast(`第 ${sessionIdx + 1} 关`);
                style.innerText = `
            #app {
                background:${this.mAppData.sessions[sessionIdx].background || ''}
            }`;
                await this.mRunSession(this.mAppData.sessions[sessionIdx], this.mAppData.options);
                sessionIdx++;
            }
            if (this.mAppData.options.allowRandom) {
                break;
            }
            while (await !this.mModal.confirm("重新开始?")) {

            }
            sessionIdx = 0;
        }
        while (true) {
            let templateSession = this.mAppData.sessions[0];
            let templateStart = templateSession.objects[templateSession.start];
            templateStart.speed = undefined;
            let templateEnd = templateSession.objects[templateSession.end];
            style.innerText = `
            #app {
                background:${templateSession.background || ''}
            }`;
            while (true) {
                await this.mModal.toast(`第 ${sessionIdx + 1} 关`);
                let mapEditor = new MapEditor();
                let mapData = mapEditor.generate(100, 100);
                templateStart.pos = mapData.start;
                templateEnd.pos = mapData.end;
                let sessionData = {
                    cells: mapData.cells,
                    cellTypes: [
                        templateSession.cellTypes.find(t => t.rigid),
                        templateSession.cellTypes.find(t => !t.rigid)],
                    objects: [
                        templateStart,
                        templateEnd
                    ],
                    start: 0,
                    end: 1,
                    viewSize: templateSession.viewSize,
                    background: templateSession.background,
                    scale: templateSession.scale
                };
                await this.mRunSession(sessionData, this.mAppData.options);
                sessionIdx++;
            }
        }
    }
}