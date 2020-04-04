export class AnimationController {
    constructor( /**@type HTMLElement */ element, /**@type Sprite */ sprite) {
        this.mElement = element;
        this.mSprite = sprite;
        this.mSetAnimation(sprite.animas.keys().next().value);
    }

    mSetAnimation( /**@type */ name) {
        this.stopAnimation();
        this.mCurrentAnima = this.mSprite.animas.get(name);
        this.mElement.style.backgroundImage = `url("${this.mCurrentAnima.url}")`;
        this.mElement.style.backgroundSize = `${this.mCurrentAnima.count}00% 100%`;
        this.mFps = 20;
    }

    playAnimation( /**@type */ name) {
        if (name !== this.mCurrentAnima.name) {
            this.mSetAnimation(name);
        }
        if (!this.mElementAnimation) {
            const count = this.mCurrentAnima.count;
            this.mElementAnimation = `${count/this.mFps}s steps(${count-1}, end) infinite sprite`;
            this.mElement.style.animation = this.mElementAnimation;
        }
    }

    stopAnimation() {
        if (this.mElementAnimation) {
            this.mElementAnimation = null;
            this.mElement.style.animation = null;
        }
    }

}