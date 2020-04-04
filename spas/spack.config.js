const path = require('path');
const fs = require('fs');

class FileUtils {
    /**
     * 
     * @param {string} file 
     * @return { string[] }
     */
    static readdir(file) {
        return new Promise((resolve, reject) => {
            fs.readdir(file, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(files);
                }
            });
        });
    }

    static exists(file) {
        return new Promise(resolve => {
            fs.exists(file, resolve);
        });
    }
}


const getEntriesInSrc = async () => {
    const srcFolder = path.join(__dirname, 'src');
    const subfolders = await FileUtils.readdir(srcFolder);
    let entries = {};
    for (let subfolder of subfolders) {
        const indexFile = path.join(srcFolder, subfolder, 'index.html');
        if (await FileUtils.exists(indexFile)) {
            entries[subfolder] = indexFile;
        }
    }
    return entries;
}

module.exports = getEntriesInSrc().then(entries => ({
    entries,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]'
    }
}));