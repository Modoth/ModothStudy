import {
    Sprite
} from './sprite.js'

import {
    Role
} from './role.js';

export class App {
    constructor( /**@type Window */ window) {
        this.mWindow = window;
        this.mDocument = this.mWindow.document;
        this.mBackground = this.mWindow.document.getElementById('background');
        this.mVoiceSwitch = this.mWindow.document.getElementById('voiceSwitch');
        this.mVoiceSwitch.onclick = () => {
            this.setVoice(!this.voiceOn);
        }
    }
    async mInitComponents() {
        const spriteConfigs = {
            '大摩': {
                url: /**@imports */ '../../assets/man.png',
                height: 1,
                width: 5,
                animas: [{
                    name: 'talking',
                }]
            },
            '小豆': {
                url: /**@imports */ '../../assets/woman.png',
                height: 1,
                width: 5,
                animas: [{
                    name: 'talking',
                }]
            }
        };
        /** @type Map<string, Sprite> */
        this.mSprites = new Map();
        for (let name in spriteConfigs) {
            const sprite = new Sprite();
            await sprite.load(spriteConfigs[name]);
            this.mSprites.set(name, sprite);
        }
    }

    setVoice(on) {
        this.voiceOn = on;
        if (on) {
            this.mVoiceSwitch.classList.add('on');
        } else {
            this.mVoiceSwitch.classList.remove('on');
        }
    }

    createRole(actor, name) {
        const sprite = this.mSprites.get(actor);
        const role = new Role(sprite, this);
        role['说'] = role.say;
        this.mBackground.appendChild(role.element);
        return role;
    }

    newSession() {
        this.mBackground.innerHTML = '';
    }

    async start() {
        await this.mInitComponents();
        this.mWindow.apis = {
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