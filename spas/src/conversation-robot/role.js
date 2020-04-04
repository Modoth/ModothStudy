import {
    AnimationController
} from './animation-controller.js'

export class Role {
    constructor( /**@type Sprite */ sprite, /**@type { voiceOn: boolean }*/ appConfig) {
        this.element = document.createElement('div');
        this.mAppConfig = appConfig;
        this.mMessage = document.createElement('div');
        this.mMessage.classList.add('message-box');
        this.mMessageArrow = document.createElement('div');
        this.mMessageArrow.classList.add('message-arrow');
        this.element.appendChild(this.mMessage);
        this.element.appendChild(this.mMessageArrow);
        this.mAnimationController = new AnimationController(this.element, sprite);
    }

    say(message) {
        this.mAnimationController.playAnimation('talking');
        this.mMessage.innerText = message;
        this.element.classList.add('talking');
        if (this.mAppConfig.voiceOn) {
            const utterThis = new SpeechSynthesisUtterance(message);
            const voices = window.speechSynthesis.getVoices();
            utterThis.voice = voices[0];
            window.speechSynthesis.speak(utterThis);
        }
        return new Promise(resolve => setTimeout(resolve, 2000)).then(() => {
            this.element.classList.remove('talking');
            this.mAnimationController.stopAnimation();
        });
    }
}