export class AnimationController {
    constructor( /**@type HTMLElement */ element, /**@type Sprite */ sprite) {
        this.element_ = element;
        this.sprite_ = sprite;
        this.setAnimation_(sprite.animas.keys().next().value);
    }

    setAnimation_( /**@type */ name) {
        this.stopAnimation();
        this.currentAnima_ = this.sprite_.animas.get(name);
        this.element_.style.backgroundImage = `url("${this.currentAnima_.url}")`;
        this.element_.style.backgroundSize = `${this.currentAnima_.count}00% 100%`;
        this.fps_ = 20;
    }

    playAnimation( /**@type */ name) {
        if (name !== this.currentAnima_.name) {
            this.setAnimation_(name);
        }
        if (!this.elementAnimation_) {
            const count = this.currentAnima_.count;
            this.elementAnimation_ = `${count/this.fps_}s steps(${count-1}, end) infinite sprite`;
            this.element_.style.animation = this.elementAnimation_;
        }
    }

    stopAnimation() {
        if (this.elementAnimation_) {
            this.elementAnimation_ = null;
            this.element_.style.animation = null;
        }
    }

}