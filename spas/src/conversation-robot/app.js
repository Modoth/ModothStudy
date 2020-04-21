import {
    Sprite
} from './sprite.js'

import {
    Role
} from './role.js';

export class App {
    constructor( /**@type Window */ window) {
        this.window_ = window;
        this.document_ = this.window_.document;
        this.background_ = this.window_.document.getElementById('background');
        this.voiceSwitch_ = this.window_.document.getElementById('voiceSwitch');
        this.voiceSwitch_.onclick = () => {
            this.setVoice(!this.voiceOn);
        }
    }
    async initComponents_() {
        const spriteConfigs = {
            '大摩': {
                url: /**@imports image */ '../../assets/man.png',
                height: 1,
                width: 5,
                animas: [{
                    name: 'talking',
                }]
            },
            '小豆': {
                url: /**@imports image */ '../../assets/woman.png',
                height: 1,
                width: 5,
                animas: [{
                    name: 'talking',
                }]
            }
        };
        /** @type Map<string, Sprite> */
        this.sprites_ = new Map();
        for (let name in spriteConfigs) {
            const sprite = new Sprite();
            await sprite.load(spriteConfigs[name]);
            this.sprites_.set(name, sprite);
        }
    }

    setVoice(on) {
        this.voiceOn = on;
        if (on) {
            this.voiceSwitch_.classList.add('on');
        } else {
            this.voiceSwitch_.classList.remove('on');
        }
    }

    createRole(actor, name) {
        const sprite = this.sprites_.get(actor);
        const role = new Role(sprite, this);
        role['说'] = role.say;
        this.background_.appendChild(role.element);
        return role;
    }

    newSession() {
        this.background_.innerHTML = '';
    }

    async start() {
        await this.initComponents_();
        this.window_.apis = {
            newSession: this.newSession.bind(this),
            '开始场景': this.newSession.bind(this),
            createRole: this.createRole.bind(this),
            '创建角色': this.createRole.bind(this),
            setTime: (time) => console.log(time),
            '设置时间': (time) => console.log(time),
            setLocation: (loc) => console.log(loc),
            '设置地点': (loc) => console.log(loc),
        };
    }
}