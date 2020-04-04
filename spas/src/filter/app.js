import {
    Modal
} from '../modal/index.js'
import {
    Config
} from './config.js'

export class App {
    constructor( /**@type Window */ window) {
        this.mWindow = window;
        this.mDocument = this.mWindow.document;
        /**@type HTMLInputElement */
        this.mTxbFilter = this.mWindow.document.getElementById('txbFilter');
        this.mTable = this.mWindow.document.getElementById('table');
        this.mStyleFont = this.mWindow.document.getElementById("styleFont");
        this.mTxbFilter.addEventListener("input", () => this.update());
        this.mBtnExport = this.mWindow.document.getElementById("btnExport");
        this.modal = new Modal();
        this.mData = new Config().appData;
        this.mCmdPrefix = "> "
        this.mCmdObj = {
            new: { name: this.mCmdPrefix + "new", exec: async () => await this.generate() },
            naming: {
                name: this.mCmdPrefix + "naming", needClick: true, exec: async (idx) => {
                    let newData = this.cloneAppData(this.mData);
                    await this.editNamesProp(newData, idx);
                    return this.promptReload(newData);
                }
            },
            style: {
                name: this.mCmdPrefix + "style", exec: async () => {
                    let style = await this.modal.prompt("样式:", this.mData.style);
                    if (style === undefined || style === null) {
                        return false;
                    }
                    style = style.trim();
                    let newData = this.cloneAppData(this.mData);
                    newData.style = style || undefined;
                    return await this.promptReload(newData);
                }
            }, value: {
                name: this.mCmdPrefix + "value", exec: async () => {
                    let valueName = await this.modal.prompt("值属性:", this.mData.valueName);
                    if (valueName === undefined || valueName === null) {
                        return false;
                    }
                    valueName = valueName.trim();
                    let newData = this.cloneAppData(this.mData);
                    newData.valueName = valueName || undefined;
                    return await this.promptReload(newData);
                }
            },
            font: {
                name: this.mCmdPrefix + "font", exec: async () => {
                    let fontUrl = await this.modal.prompt("字体URL:");
                    debugger;
                    if (fontUrl === undefined || fontUrl === null) {
                        return false;
                    }
                    fontUrl = fontUrl.trim();
                    let font
                    if (fontUrl) {
                        let fontFormat = await this.modal.prompt("字体格式:");
                        if (fontFormat === undefined || fontFormat === null) {
                            return false;
                        }
                        fontFormat = fontFormat.trim() || undefined;
                        font = { url: fontUrl, format: fontFormat }
                    } else {
                        font = undefined;
                    }
                    let newData = this.cloneAppData(this.mData);
                    newData.font = font;
                    return await this.promptReload(newData);
                }
            },
            exportData: {
                name: this.mCmdPrefix + "export", exec: async () => {
                    await this.promptReload(this.mData);
                    return false;
                }
            },
            styling: {
                name: this.mCmdPrefix + "styling", needClick: true, exec: async (idx) => {
                    let newData = this.cloneAppData(this.mData);
                    await this.editStyleProp(newData, idx);
                    return this.promptReload(newData);
                }
            }
        }
        this.mCmds = Object.values(this.mCmdObj);
    }

    async generate() {
        if (this.isGenerating) {
            return true;
        }
        this.isGenerating = true;
        let res = await this.generateInternal();
        this.isGenerating = false;
        return res;
    }

    async generateInternal() {
        let dataStr = await this.modal.prompt("查询列表(空白分割)或格式化数据:");
        dataStr = dataStr && dataStr.trim();
        if (!dataStr) {
            return false;
        }
        let appData
        try {
            appData = JSON.parse(dataStr);
        }
        catch{
            //ignore
        }
        if (appData && appData.items && appData.items.length) {
            await this.load(appData);
            return true;
        }
        let keys = [...new Set(dataStr.split(" ").filter(s => s != "" && s != " "))];
        if (keys.length == 0) {
            return false;
        }
        let items = keys.map(key => ({ key }));
        if (!await this.modal.confirm(`共计${keys.length}:${keys.slice(0, 3).join(", ")}${keys.length > 3 ? "..." : ""}`)) {
            return false;
        }
        appData = { items };
        await this.editNamesProp(appData);
        return await this.promptReload(appData);
    }

    async editStyleProp(appData, startIdx = 0) {
        return await this.editProp(appData, "style", (item, propStr) => {
            item.style = propStr || undefined;
            return true;
        }, startIdx);
    }

    async editNamesProp(appData, startIdx = 0) {
        return await this.editProp(appData, "names", (item, propStr) => {
            let names = [...new Set(propStr.split(" ").filter(s => s != "" && s != " "))]
            item.names = names.length == 0 ? undefined : names;
            return true;
        }, startIdx);
    }

    async editProp(appData, prop, updateProp, startIdx = 0) {
        let items = appData.items;
        for (var i = startIdx; i < items.length; i++) {
            let item = items[i]
            if (!item) {
                throw "Invalid Data";
            }
            let propStr = await this.modal.prompt(`【${item.key}】的${prop}属性:`, item[prop] && item[prop].join(" ") || '')
            if (propStr === null || propStr === undefined) {
                return false;
            }
            propStr = propStr && propStr.trim();
            if (!updateProp(item, propStr)) {
                return false;
            }
        }
        return true;
    }

    async promptReload(data) {
        if (await this.modal.prompt("加载？", JSON.stringify(data)) && data != this.mData) {
            await this.load(data);
            return true
        }
        return false;
    }

    like( /**@type string*/ value, /**@type string*/ filter) {
        return value.indexOf(filter) >= 0
    }

    async sleep(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    async update() {
        let filter = this.mTxbFilter.value || "";
        let cmd = this.mCmds.find(c => c.name === filter);
        if (cmd) {
            if (cmd.needClick) {
                filter = ""
            } else {
                this.mTxbFilter.value = "";
                this.mFilter = undefined;
                if (await cmd.exec()) {
                    return;
                }
                filter = "";
            }
        }
        if (this.mFilter === filter) {
            return;
        }
        this.mFilter = filter;
        if (this.updateTask) {
            await this.updateTask;
            this.updateTask = null;
        }
        this.updateTask = this.updateInternal(filter);
        await this.updateTask;
        this.updateTask = null;
    }

    cloneAppData(data) {
        return {
            items: data.items && data.items.slice(),
            font: data.font && Object.assign({}, data.font),
            style: data.style
        }
    }

    async updateInternal(filter) {
        this.mTable.innerHTML = "";
        let taskCount = 100;
        let taskDelay = 0;
        let current = 0;
        while (current < this.mData.items.length) {
            await this.sleep(taskDelay);
            if (this.mFilter !== filter) {
                return;
            }
            let next = current + taskCount;
            let items = filter ? this.mData.items.slice(current, next)
                .filter(p => this.like(p.key, filter) || (p.names && p.names.some(v => this.like(v, filter)))) :
                this.mData.items.slice(current, next);
            current = next;
            for (let item of items) {
                let div = document.createElement("div");
                let textSpan = document.createElement("span");
                if (item.style) {
                    textSpan.style = item.style
                    textSpan.classList.add("trans-text");
                }
                const useValueName = this.mData.valueName && item[this.mData.valueName];
                textSpan.innerText = useValueName ? item[this.mData.valueName] : item.key;
                textSpan.onclick = async () => {
                    let filter = this.mTxbFilter.value || "";
                    let cmd = this.mCmds.find(c => c.name === filter);
                    if (cmd && cmd.needClick) {
                        let idx = this.mData.items.indexOf(item);
                        if (idx >= 0) {
                            await cmd.exec(idx)
                        }
                        return;
                    }
                    let range = document.createRange();
                    range.selectNode(textSpan);
                    let selection = window.getSelection()
                    selection.removeAllRanges();
                    selection.addRange(range);
                    if (document.execCommand('copy')) {
                        this.modal.toast(`已复制:${item.key}` + (useValueName ? `的${this.mData.valueName}` : ""));
                    }
                    setTimeout(() => {
                        selection.removeAllRanges();
                    }, 0);
                }
                div.appendChild(textSpan);
                this.mTable.appendChild(div);
            }
        }
    }

    async load(data) {
        this.mData = data;
        this.mTxbFilter.value = "";
        let style = data.font && data.font.url ?
            `@font-face {
            font-family: 'keys-font';
            src: url("${data.font.url}") format("${data.font.format}");
            font-weight: normal;
            font-style: normal;
        }
        `
            : '';
        style += data.style || '';
        this.mStyleFont.innerText = style;
        this.mFilter = undefined
        await this.update();
    }

    async start() {
        let data = this.mWindow.appData && this.mWindow.appData.items ? this.mWindow.appData : this.mData
        await this.load(data);
    }
}