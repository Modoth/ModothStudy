/**
 * @param { string } url 
 * @return { Promise<{ width:number, height:number, getImageData: (sx: number, sy: number, sw: number, sh: number) => ImageData }> }
 */
export const getImageDataProvider = (url) => {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.width = img.naturalWidth;
            ctx.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            resolve(ctx);
        }
        img.onerror = () => reject();
        img.src = url;
    })
}

/**
 * 
 * @param {ImageData} imageData 
 * @return { string }
 */
export const imageDataToDataUrl = (imageData) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}