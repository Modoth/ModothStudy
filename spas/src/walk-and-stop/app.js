import { Modal } from '../modal/index.js'
import { Game, Camera, Gbject, Rigid, Body, Session, Walker, Controller, ColorBodyProvider, MapBodyProvider, TextBodyProvider, ColorTranslator, GameContext, ImageLoader, ImageBodyProvider, AnimationController, Vector2, sleep } from '../game/game.js'
import { MapGenerator } from './map-generator.js';
export class App {
    constructor(/**@type HTMLElement */ root, appData) {
        this.root_ = root;
        this.appData_ = appData;
        this.modal_ = new Modal();
        this.colorTranslator_ = new ColorTranslator();
    }

    getBodyProvider_(cache, type, size) {
        let provider;
        let imgData = cache.imgDatas.get(type);
        if (imgData) {
            provider = new ImageBodyProvider(size, size, type.img, imgData, type.animations);
        } else if (type.text) {
            provider = new TextBodyProvider(size, size, type.text, type.color);
        } else {
            provider = new ColorBodyProvider(size, size, cache.rgbaColors.get(type))
        }
        return new Body(provider);
    }

    async calculate_(props, rules, gamePauseToast) {
        if (!rules) {
            return;
        }
        for (let k of Object.keys(rules)) {
            props[k] = (props[k] >>> 0) + rules[k]
            if (gamePauseToast) {
                await gamePauseToast(`${k} ${rules[k]}`, 1000, 1000);
            }
        }
    }

    async doFight_(objsProps, attacker, defender, gamePauseToast) {
        let attackerProps = objsProps.get(attacker);
        let defenderProps = objsProps.get(defender);
        if (attacker.attack) {
            this.calculate_(defenderProps, attacker.attack.other)
            await this.calculate_(attackerProps, attacker.attack.self, gamePauseToast)
        }
        if (defender.attack) {
            await this.calculate_(attackerProps, defender.attack.other, gamePauseToast)
            this.calculate_(defenderProps, defender.attack.self)
        }
    }

    async runSession_(appData, sessionData, cache) {
        const game = new Game(this.root_, appData);
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
            let imgData = cache.imgDatas.get(type);
            let gbj = new Gbject('', obj.pos[1] * mapScale, obj.pos[0] * mapScale,
                this.getBodyProvider_(cache, type, obj.scale),
                ...(type.rigid ? [new Rigid(obj.scale, obj.scale)] : []),
                ...(imgData && type.animations ? [new AnimationController(type.animations)] : [])
            )
            gbj[AnimationController.name] && gbj[AnimationController.name].play("stop");
            return gbj;
        })

        const player = objects[sessionData.start];
        const endPoint = objects[sessionData.end];

        const objectsPool = new Map(appData.types.map(t => [t, []]));
        const captureObject = (type) => {
            let obj = objectsPool.get(type).pop();
            if (!obj) {
                let imgData = cache.imgDatas.get(type);
                obj = new Gbject('', 0, 0,
                    this.getBodyProvider_(cache, type, mapScale),
                    new Rigid(mapScale, mapScale),
                    ...(imgData && type.animations ? [new AnimationController(type.animations)] : [])
                );
                obj.__obj_type__ = type;
                obj[AnimationController.name] && obj[AnimationController.name].play("stop");
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
        const propsElement = document.getElementById('props');
        const directionElement = document.getElementById('direction');
        const distanceElement = document.getElementById('distance');
        document.getElementById('map').onclick = async () => {
            const newSession = this.cloneSession_(sessionData);
            const newAppData = Object.assign({}, appData);
            newAppData.sessions = [newSession];
            newSession.objects[newSession.start].pos = [...playerPos]
            const editor = new MapEditor(this.modal_);
            if (await editor.edit(newAppData, newSession)) {
                game.stop();
                sessionRet = newSession;
            }
        }
        distanceElement.innerHTML = '';
        displayElement.classList.remove("hidden")
        let lastPos;
        let lastAnimation;
        let initProps = (obj) => {
            return Object.assign({}, obj.initProps);
        }
        let refreshProps = (props) => {
            propsElement.innerHTML = '';
            propsElement.classList.add('hidden');
            let hasProps = false;
            for (let prop in props) {
                hasProps = true;
                let div = document.createElement('div');
                let propEle = document.createElement('span');
                propEle.innerText = prop;
                propEle.classList.add('object-prop');
                let valueEle = document.createElement('span');
                valueEle.innerText = props[prop] ? `x ${props[prop]}` : ' ';
                valueEle.classList.add('object-value');
                div.appendChild(propEle);
                div.appendChild(valueEle);
                propsElement.appendChild(div);
            }
            if (hasProps) {
                propsElement.classList.remove('hidden');
            }
        }
        let objsProps = new Map(sessionData.objects.map(obj => [obj, initProps(obj)]))
        let attacker = sessionData.objects[sessionData.start];
        refreshProps(objsProps.get(attacker));
        let gamePauseToast = async (msg, timeout, wait_timeout = 0) => {
            game.pause();
            await this.modal_.toast(msg, timeout);
            wait_timeout && await sleep(wait_timeout);
            game.resume();
        }
        let getCant = (obj, cant) => {
            if (!cant) {
                return null;
            }
            if (!obj.name) {
                return cant;
            }
            return `${obj.name}: ${cant}`
        }
        player.addComponents(
            new Walker(sessionData.objects[sessionData.start].speed || sessionData.ppu / 3, true),
            new Camera(sessionData.ppu, 1),
            new Controller({
                onclick: async (loc) => {
                    let clickPos = [Math.floor(loc.y / mapScale + 0.5), Math.floor(loc.x / mapScale + 0.5)]
                    let isWall = clickPos[0] > 0 && clickPos[0] < mapHeight && clickPos[1] >= 0 && clickPos[1] < mapWidth
                        && appData.types[sessionData.cells[clickPos[0]][clickPos[1]]].rigid;
                    let defenderIdx = objects.findIndex(obj => Math.floor(obj.position.y / mapScale + 0.5) == clickPos[0] && Math.floor(obj.position.x / mapScale + 0.5) == clickPos[1])
                    let defender = sessionData.objects[defenderIdx];
                    if (objects[defenderIdx] && defender) {
                        if (defender != attacker) {
                            isWall = appData.types[defender.type].rigid;
                            let attackerPos = [Math.floor(player.position.y / mapScale), Math.floor(player.position.x / mapScale)]
                            if (Math.abs(attackerPos[0] - clickPos[0]) + Math.abs(attackerPos[1] - clickPos[1]) < 1.5) {
                                if (!defender.attack && defender == sessionData.objects[sessionData.end]) {
                                    attacker.successCant && await gamePauseToast(getCant(attacker, attacker.successCant));
                                    success = true;
                                    displayElement.classList.add("hidden")
                                    game.stop()
                                    return;
                                }
                                if ((defender.attack || attacker.attack)) {
                                    if (defender.attackCant) {
                                        await gamePauseToast(getCant(defender, defender.attackCant));
                                    }
                                    await this.doFight_(objsProps, attacker, defender, gamePauseToast);
                                    refreshProps(objsProps.get(attacker));
                                    if (defender.failedCondition
                                        && objsProps.get(defender)[defender.failedCondition.prop] <= (defender.failedCondition.threshold || 0)) {
                                        objects[defenderIdx].enabled = false;
                                        player.positionUpdated = true;
                                        objects[defenderIdx] = undefined;
                                        if (defender.failedCant) {
                                            await gamePauseToast(getCant(defender, defender.failedCant));
                                        }
                                    }
                                    if (attacker.failedCondition
                                        && objsProps.get(attacker)[attacker.failedCondition.prop] <= (attacker.failedCondition.threshold || 0)) {
                                        if (defender.successCant) {
                                            await gamePauseToast(getCant(defender, defender.successCant))
                                        }
                                        await gamePauseToast(getCant(attacker, attacker.failedCant) || '失败');
                                        success = false;
                                        displayElement.classList.add("hidden")
                                        game.stop()
                                        return;
                                    }

                                    if (attacker.successCondition
                                        && objsProps.get(attacker)[attacker.successCondition.prop] >= (attacker.successCondition.threshold || 1)) {
                                        attacker.successCant && await gamePauseToast(getCant(attacker, attacker.successCant));
                                        success = true;
                                        displayElement.classList.add("hidden")
                                        game.stop()
                                        return;
                                    }
                                    return
                                }
                            }
                        }
                        if (defender.cant) {
                            this.modal_.toast(getCant(defender, defender.cant));
                            return;
                        }
                    }
                    let avaliablePos = isWall ?
                        [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([y, x]) => [y + clickPos[0], [x + clickPos[1]]])
                        : [clickPos]
                    avaliablePos = avaliablePos.map(([y, x]) => new Vector2(x * mapScale, y * mapScale));
                    player[Walker.name].walkTo(...avaliablePos);
                },
                onframe: async (/**@type GameContext */ ctx) => {
                    let dist = Math.hypot(endPoint.position.x - player.position.x,
                        endPoint.position.y - player.position.y) / mapScale
                    let animationController = player[AnimationController.name];
                    if (animationController) {
                        if (lastPos) {
                            const animationJudge = 0.00001 * player[Rigid.name].size.x;
                            let animation;
                            if (player.position.x - lastPos.x > animationJudge) {
                                animation = 'right';
                            } else if (lastPos.x - player.position.x > animationJudge) {
                                animation = 'left'
                            } else if (player.position.y - lastPos.y > animationJudge) {
                                animation = 'down'
                            } else if (lastPos.y - player.position.y > animationJudge) {
                                animation = 'up'
                            }
                            else {
                                animation = 'stop';
                            }
                            if (animation && animation != lastAnimation) {
                                lastAnimation = animation;
                                animationController.play(lastAnimation);
                            }
                        }
                        lastPos = new Vector2(player.position.x, player.position.y);
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
                    let left_ = Math.max(Math.floor(ctx.wxmin / mapScale) - 1, 0);
                    let right_ = Math.min(Math.ceil(ctx.wxmax / mapScale) + 1, mapWidth - 1);
                    let top_ = Math.max(Math.floor(ctx.wymin / mapScale) - 1, 0);
                    let bottom_ = Math.min(Math.ceil(ctx.wymax / mapScale) + 1, mapHeight - 1);
                    if (lastMapRegion.left_ == left_ && lastMapRegion.right_ == right_
                        && lastMapRegion.top_ == top_ && lastMapRegion.bottom_ == bottom_) {
                        return;
                    }
                    lastMapRegion = { left_, right_, top_, bottom_ }
                    let nextWallVisiableTable = new Map();
                    for (let j = top_; j <= bottom_; j++) {
                        for (let i = left_; i <= right_; i++) {
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
        return { success, sessionRet: success ? sessionRet : sessionData };
    }

    async run() {
        if (this.appData_.background) {
            document.getElementById("styleBackground").innerText = `
                #app {
                    background:${this.appData_.background}
                }`;
        }
        const cache = { rgbaColors: new Map(), imgDatas: new Map() };
        let imgLoader;
        let imgDatas = new Map();
        if (this.appData_.imgs && this.appData_.imgs.length) {
            imgLoader = imgLoader || new ImageLoader();
            for (let i = 0; i < this.appData_.imgs.length; i++) {
                imgDatas.set(i, await imgLoader.load(this.appData_.imgs[i]))
            }
        }
        for (const t of this.appData_.types) {
            if (t.color) {
                cache.rgbaColors.set(t, this.colorTranslator_.translate(t.color))
            }
            if (t.img) {
                cache.imgDatas.set(t, imgDatas.get(t.img.index));
            }
        };
        for (let session of this.appData_.sessions || []) {
            session.scale = session.scale >>> 0 || 1;
            session.objects.forEach(obj => obj.scale = obj.scale >>> 0 || 1)
            for (let i = 0; i < session.cells.length; i++) {
                session.cells[i] = Array.from(session.cells[i], c => c >>> 0);
            }
        }
        let sessionIdx = 0;
        let getSessionData = async () => {
            if (this.appData_.sessions) {
                if (sessionIdx < this.appData_.sessions.length) {
                    return this.appData_.sessions[sessionIdx];
                }
                if (!this.appData_.allowRandom) {
                    while (await !this.modal_.confirm("重新开始?")) {
                    }
                    sessionIdx = 0;
                    return this.appData_.sessions[sessionIdx];
                }
            }
            let templateSession = this.appData_.sessions[0];
            let mapGen = new MapGenerator();
            let mapData = mapGen.generate(100, 100);
            let startType, endType
            if (templateSession) {
                startType = templateSession.objects[templateSession.start].type
                endType = templateSession.objects[templateSession.end].type
            } else {
                let revTypes = [...this.appData_.types].reverse();
                startType = revTypes.length - 1 - revTypes.findIndex(t => t.rigid);
                endType = revTypes.length - 1 - revTypes.findIndex(t => !t.rigid);
            }
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
                ppu: 30,
                scale: 1
            };
            return sessionData;
        }
        let toloadSession;
        while (true) {
            const sessionData = toloadSession || await getSessionData();
            this.modal_.toast(`第 ${sessionIdx + 1} 关`);
            const { sessionRet } = await this.runSession_(this.appData_, sessionData, cache);
            toloadSession = sessionRet
            if (!sessionRet) {
                sessionIdx++;
            }
        }
    }

    cloneSession_(sessionData) {
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
        this.modal_ = modal;
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
                await this.modal_.prompt("请复制", JSON.stringify(Object.assign({}, appData, {
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
        return await this.modal_.popup(editorEle, (close) => {
            closeModal = close;
        }, false);
    }
}