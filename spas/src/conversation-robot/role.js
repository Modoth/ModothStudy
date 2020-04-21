import {
    AnimationController
} from './animation-controller.js'

export class Role {
    constructor( /**@type Sprite */ sprite, /**@type { voiceOn: boolean }*/ appConfig) {
        this.element = document.createElement('div');
        this.appConfig_ = appConfig;
        this.message_ = document.createElement('div');
        this.message_.classList.add('message-box');
        this.messageArrow_ = document.createElement('div');
        this.messageArrow_.classList.add('message-arrow');
        this.element.appendChild(this.message_);
        this.element.appendChild(this.messageArrow_);
        this.animationController_ = new AnimationController(this.element, sprite);
    }

    say(message) {
        this.animationController_.playAnimation('talking');
        this.message_.innerText = message;
        this.element.classList.add('talking');
        if (this.appConfig_.voiceOn) {
            const utterThis = new SpeechSynthesisUtterance(message);
            const voices = window.speechSynthesis.getVoices();
            utterThis.voice = voices[0];
            window.speechSynthesis.speak(utterThis);
        }
        return new Promise(resolve => setTimeout(resolve, 2000)).then(() => {
            this.element.classList.remove('talking');
            this.animationController_.stopAnimation();
        });
    }
}