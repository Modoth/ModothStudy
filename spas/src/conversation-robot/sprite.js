import {
    getImageDataProvider,
    imageDataToDataUrl
} from './image-utils.js'

/**
 * @typedef SpriteConfig
 * @property { string }  url
 * @property { {name: string, count: number}[] } animas
 * @property { number } width
 * @property { number} height
 * @property { number? } offsetX
 * @property { number? } offsetY
 */

export class Sprite {
    normalizeConfig_( /**@type SpriteConfig */ config) {
        if (!config) {
            throw new Error('config can not be null');
        }
        config.width = Math.max(1, config.width >>> 0);
        config.height = Math.max(1, config.height >>> 0);
        config.offsetX = config.offsetX >>> 0;
        config.offsetY = config.offsetY >>> 0;
        const maxCount = config.width - config.offsetX;
        for (let anima of config.animas) {
            anima.count = anima.count > 0 ? Math.min(anima.count, maxCount) : maxCount;
        }
    }

    async load( /**@type SpriteConfig */ config) {
        this.normalizeConfig_(config);
        const imagDataProvider = await getImageDataProvider(config.url);
        const pWidth = imagDataProvider.width / config.width;
        const pHeight = imagDataProvider.height / config.height;
        /**@type Map<string, {name:string, count:number, url: string } */
        this.animas = new Map();
        for (let y = 0; y < config.animas.length; y++) {
            const anima = config.animas[y];
            const rowImageData = imagDataProvider.getImageData(config.offsetX * pWidth, (y + config.offsetY) *
                pHeight,
                pWidth * (anima.count + config.offsetX), pHeight);
            const rowImageUrl = imageDataToDataUrl(rowImageData);
            this.animas.set(anima.name, {
                name: anima.name,
                url: rowImageUrl,
                count: anima.count,
            });
        };
    }
}