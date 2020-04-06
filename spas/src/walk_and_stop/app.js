import { Modal } from '../modal/index.js'
import { Game, Camera, Gbject, Rigid, Body, Session, Walker, Controller, ColorBodyProvider, MapBodyProvider, TextBodyProvider, ColorTranslator, GameContext } from '../game/game.js'
import { MapGenerator } from './map_generator.js';
export class App {
    constructor(/**@type HTMLElement */ root, appData) {
        this.mRoot = root;
        this.mAppData = appData;
        this.mModal = new Modal();
        this.mColorTranslator = new ColorTranslator();
    }

    async mRunSession(appData, sessionData, cache) {
        const game = new Game(this.mRoot, appData);
        let sessionRet;
        const session = new Session();
        const mapHeight = sessionData.cells.length;
        const mapWidth = sessionData.cells[0].length;
        const mapScale = sessionData.scale;
        const transparentColor = { r: 0, g: 0, b: 0, a: 0 };
        const map = new Gbject("map", (mapWidth - 1) * mapScale / 2, (mapHeight - 1) * mapScale / 2,
            new Body(new MapBodyProvider(mapWidth, mapHeight,
                Array.from({ length: mapWidth * mapHeight }, (_, i) => {
                    const type = appData.types[sessionData.cells[Math.floor(i / mapWidth)][i % mapWidth]];
                    return !type || type.rigid ? transparentColor : cache.rgbaColors.get(type)
                }), mapScale)));
        const objects = sessionData.objects.map(obj => {
            const type = appData.types[obj.type];
            return new Gbject('', obj.pos[1] * mapScale, obj.pos[0] * mapScale,
                new Body(obj.text ?
                    new TextBodyProvider(obj.scale, obj.scale, type.text, type.color) :
                    new ColorBodyProvider(obj.scale, obj.scale, cache.rgbaColors.get(type))),
                ...(type.rigid ? [new Rigid(obj.scale, obj.scale)] : [])
            )
        })

        const player = objects[sessionData.start];
        const endPoint = objects[sessionData.end];

        const objectsPool = new Map(appData.types.map(t => [t, []]));
        const captureObject = (type) => {
            let obj = objectsPool.get(type).pop();
            if (!obj) {
                obj = new Gbject('', 0, 0,
                    new Body(
                        type.text ?
                            new TextBodyProvider(mapScale, mapScale, type.text, type.color) :
                            new ColorBodyProvider(mapScale, mapScale, cache.rgbaColors.get(type))
                    ),
                    new Rigid(mapScale, mapScale));
                obj.__obj_type__ = type;
                session.gbjects.push(obj);
            }
            else {
                obj.enabled = true;
            }
            return obj;
        }
        const releaseObject = (obj) => {
            obj.enabled = false;
            objectsPool.get(obj.__obj_type__).push(obj);
        }

        let success = false;
        let wallVisiableTable = new Map();
        let lastMapRegion = {};
        let lastRefreshLocTime = 0;
        let refreshLocRegion = 1000;
        let lastDist = 0;
        let playerPos = sessionData.objects[sessionData.start].pos

        const displayElement = document.getElementById('display');
        const directionElement = document.getElementById('direction');
        const distanceElement = document.getElementById('distance');
        displayElement.onclick = async () => {
            const newSession = this.mCloneSession(sessionData);
            const newAppData = Object.assign({}, appData);
            newAppData.sessions = [newSession];
            newSession.objects[newSession.start].pos = [...playerPos]
            const editor = new MapEditor(this.mModal);
            if (await editor.edit(newAppData, newSession)) {
                game.stop();
                sessionRet = newSession;
            }
        }
        distanceElement.innerHTML = '';
        displayElement.classList.remove("hiden")

        player.addComponents(
            new Walker(sessionData.objects[sessionData.start].speed || sessionData.viewSize / 2, true),
            new Camera(sessionData.viewSize, 1),
            new Controller({
                onclick: (loc) => player[Walker.name].walkTo(loc),
                onframe: async (/**@type GameContext */ ctx) => {
                    let dist = Math.hypot(endPoint.position.x - player.position.x,
                        endPoint.position.y - player.position.y) / mapScale
                    if (dist < 1) {
                        success = true;
                        displayElement.classList.add("hiden")
                        game.stop();
                        return;
                    }
                    let now = Date.now();
                    if (now - lastRefreshLocTime > refreshLocRegion && lastDist != Math.floor(dist)) {
                        lastDist = Math.floor(dist);
                        lastRefreshLocTime = now;
                        let deg = Math.floor(Math.acos((endPoint.position.x - player.position.x) / dist / mapScale) * 180 / Math.PI);
                        if (endPoint.position.y < player.position.y) {
                            deg = 360 - deg;
                        }
                        directionElement.style.transform = `rotate(${deg}deg)`
                        distanceElement.innerText = `终点: ${lastDist}`;
                    }
                    playerPos = [Math.floor(player.position.y / mapScale), Math.floor(player.position.x / mapScale)]
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
                                let type = appData.types[sessionData.cells[j][i]];
                                if (type.rigid) {
                                    let wall = captureObject(type)
                                    wall.position.x = i * mapScale;
                                    wall.position.y = j * mapScale;
                                    nextWallVisiableTable.set(idx, wall);
                                }

                            }
                        }
                    }
                    for (let p of wallVisiableTable) {
                        releaseObject(p[1])
                    }
                    wallVisiableTable = nextWallVisiableTable;
                }
            }));

        session.gbjects.push(map, ...objects);
        await game.start(session);
        return { success, sessionRet };
    }

    async run() {
        if (this.mAppData.background) {
            document.getElementById("styleBackground").innerText = `
                #app {
                    background:${this.mAppData.background}
                }`;
        }
        const cache = { rgbaColors: new Map() };
        this.mAppData.types.forEach(t => cache.rgbaColors.set(t, this.mColorTranslator.translate(t.color)));
        for (let session of this.mAppData.sessions || []) {
            session.scale = session.scale >>> 0 || 1;
            session.objects.forEach(obj => obj.scale = obj.scale >>> 0 || 1)
            for (let i = 0; i < session.cells.length; i++) {
                session.cells[i] = Array.from(session.cells[i], c => c >>> 0);
            }
        }
        let sessionIdx = 0;
        let getSessionData = async () => {
            if (this.mAppData.sessions) {
                if (sessionIdx < this.mAppData.sessions.length) {
                    return this.mAppData.sessions[sessionIdx];
                }
                if (!this.mAppData.allowRandom) {
                    while (await !this.mModal.confirm("重新开始?")) {
                    }
                    sessionIdx = 0;
                    return this.mAppData.sessions[sessionIdx];
                }
            }
            let mapGen = new MapGenerator();
            let mapData = mapGen.generate(100, 100);
            let revTypes = [...this.mAppData.types].reverse();
            let startType = revTypes.length - 1 - revTypes.findIndex(t => t.rigid);
            let endType = revTypes.length - 1 - revTypes.findIndex(t => !t.rigid);
            let sessionData = {
                cells: mapData.cells,
                objects: [
                    {
                        type: startType,
                        pos: mapData.start,
                        scale: 1,
                    },
                    {
                        type: endType,
                        pos: mapData.end,
                        scale: 1,
                    },
                ],
                start: 0,
                end: 1,
                viewSize: 15,
                scale: 1
            };
            return sessionData;
        }
        let toloadSession;
        while (true) {
            const sessionData = toloadSession || await getSessionData();
            this.mModal.toast(`第 ${sessionIdx + 1} 关`);
            const { sessionRet } = await this.mRunSession(this.mAppData, sessionData, cache);
            toloadSession = sessionRet
            if (!sessionRet) {
                sessionIdx++;
            }
        }
    }

    mCloneSession(sessionData) {
        return Object.assign({}, sessionData, {
            cells: sessionData.cells.map(row => [...row]),
            objects: sessionData.objects.map(obj => ({
                type: obj.type,
                pos: [...obj.pos],
                scale: obj.scale
            }))
        })
    }
}

class MapEditor {
    constructor(/**@type Modal */ modal) {
        this.mModal = modal;
    }

    async edit(appData, sessionData) {
        let editorEle = document.createElement('div');
        editorEle.classList.add('editor');
        let btnGroup = document.createElement("div");
        let placeStart = false;
        let placeEnd = false;
        let closeModal;
        let edit = false;
        btnGroup.classList.add('map-editor-btn-group');
        const btns = [{
            name: '返回',
            onclick: () => {
                closeModal(false);
            }
        }, {
            name: '编辑',
            class: "no-editing",
            onclick: () => {
                edit = true;
                btnGroup.classList.add("editing")
            }
        }, {
            name: '起点',
            class: "editing",
            onclick: (btn) => {
                placeStart = !placeStart
                if (placeStart) {
                    btn.ele.classList.add('highlight')
                }
                else {
                    btn.ele.classList.remove('highlight')
                }
            }
        }, {
            name: '终点',
            class: "editing",
            onclick: (btn) => {
                placeEnd = !placeEnd;
                if (placeEnd) {
                    btn.ele.classList.add('highlight')
                }
                else {
                    btn.ele.classList.remove('highlight')
                }
            }
        }, {
            name: '导出',
            onclick: async () => {
                let strSession = Object.assign({}, sessionData, { cells: sessionData.cells.map(r => r.join("")) })
                await this.mModal.prompt("请复制", JSON.stringify(Object.assign({}, appData, {
                    sessions: [strSession]
                })));
            }
        }, {
            name: '确定',
            class: "editing",
            onclick: () => {
                closeModal(true);
            }
        }];
        btns.forEach(btn => {
            const btnEle = document.createElement('span')
            btnEle.innerText = btn.name;
            btn.ele = btnEle;
            btnEle.onclick = () => btn.onclick(btn)
            btnEle.classList.add('map-editor-btn')
            if (btn.class) {
                btnEle.classList.add(btn.class);
            }
            btnGroup.appendChild(btnEle);
        })
        let tableEle = document.createElement("div");
        tableEle.classList.add('table')
        let startPos = sessionData.objects[sessionData.start].pos;
        let endPos = sessionData.objects[sessionData.end].pos;
        let standType = sessionData.cells[startPos[0]][startPos[1]];
        let startCell;
        let endCell;
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
                    startCell = cellEle;
                }
                if (j == endPos[0] && i == endPos[1]) {
                    cellEle.classList.add(`cell-end`)
                    endCell = cellEle;
                }
                cellEle.onclick = () => {
                    if (!edit) {
                        return;
                    }
                    if (placeStart) {
                        if (sessionData.cells[j][i] != standType) {
                            return
                        }
                        startCell.classList.remove('cell-start')
                        startPos[0] = j;
                        startPos[1] = i;
                        startCell = cellEle;
                        startCell.classList.add('cell-start')
                        btns[0].onclick(btns[0])
                        return;
                    }
                    if (placeEnd) {
                        if (sessionData.cells[j][i] != standType) {
                            return
                        }
                        endCell.classList.remove('cell-end')
                        endPos[0] = j;
                        endPos[1] = i;
                        endCell = cellEle;
                        endCell.classList.add('cell-end')
                        btns[1].onclick(btns[1])
                        return;
                    }
                    if ((j == startPos[0] && i == startPos[1]) || (j == endPos[0] && i == endPos[1])) {
                        return;
                    }
                    cellEle.classList.remove(`cell-${sessionData.cells[j][i]}`)
                    sessionData.cells[j][i] = sessionData.cells[j][i] == 0 ? 1 : 0;
                    cellEle.classList.add(`cell-${sessionData.cells[j][i]}`)
                }
                rowEle.appendChild(cellEle);
            }
        }
        editorEle.appendChild(tableEle);
        editorEle.appendChild(btnGroup);
        return await this.mModal.popup(editorEle, (close) => {
            closeModal = close;
        }, false);
    }
}