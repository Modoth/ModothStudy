const path = require('path');
const fs = require('fs');

class FileUtils {
    /**
     * 
     * @param {string} file 
     * @return { Buffer }
     */
    static readFile(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data);
                }
            });
        });
    }

    static exists(file) {
        return new Promise(resolve => {
            fs.exists(file, resolve);
        });
    }

    static mkdir(dir) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            });
        });
    }

    static async createPaths(dir) {
        if (await FileUtils.exists(dir)) {
            return
        }
        const parent = path.dirname(dir);
        if (!await FileUtils.exists(parent)) {
            await FileUtils.createPaths(parent);
        }
        await FileUtils.mkdir(dir);

    };

    static async writeFile(filepath, content) {
        await FileUtils.createPaths(path.dirname(filepath));
        return await new Promise((resolve, reject) => {
            fs.writeFile(filepath, content, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            })
        })
    }
}

class ImporterUtils {
    static getModuleInfos( /** @type string */ content, /**@type RegExp */ reg, contentToInsert) {
        const moduleInfos = [];
        while (true) {
            const match = reg.exec(content);
            if (!match) {
                break;
            }
            moduleInfos.push({
                startIdx: match.index,
                length: match[0].length,
                filename: match[1],
                contentToInsert
            })
        }
        return moduleInfos;
    }
}

class HtmlScriptAdaper {
    constructor() {
        this.reg = /<script[^>]+src="([^">]*)"[^>]*>\s*<\/script>/gm;
    }
    convert(content) {
        return `<script>\n${content}\n</script>`;
    }
}

class HtmlCssAdaper {
    constructor() {
        this.reg = /<link rel="stylesheet" type="text\/css" href="([^"]*\.css)">/gm;
    }
    convert(content) {
        return `<style>\n${content}\n</style>`;
    }
}

class JsPngAdaper {
    constructor() {
        this.reg = /\/\*\*\s*@imports\s*\*\/ '([^']*)'/gm;
    }
    convert(content) {
        return `'data:image/png;base64,${content.toString('base64')}'`;
    }
}

class JsJsAdaper {
    constructor() {
        this.reg = /^import(?:.*\s*)*?.*from.*'(.*)'/gm;
    }
    convert(content) {
        content = content.replace(/^\s*export\s*/g, '\n');
        content = content.replace(/\n\s*export\s*/g, '\n');
        return content;
    }
}

class TextImporter {

    constructor( /**@type {reg : RegExp, convert:(any) => string }[] */ ...adapters) {
        this.adapters = adapters;
    }

    async import(filepath, context) {
        const buffer = await FileUtils.readFile(filepath);
        /** @type string */
        const content = buffer.toString('utf-8');
        if (!(this.adapters && this.adapters.length > 0)) {
            return {
                content
            }
        }
        let moduleInfos = [];
        moduleInfos = this.adapters.map(a => ImporterUtils.getModuleInfos(content, a.reg, a.convert))
            .reduce((r, i) => r.concat(i), []).sort((a, b) => a.startIdx - b.startIdx);

        moduleInfos.forEach(i => {
            i.filepath = path.resolve(filepath, '..', i.filename);
            context.toImport(i.filepath);
        });
        return {
            getContent: (ctx) => {
                let startIdx = 0;
                let slices = [];
                for (let i of moduleInfos) {
                    slices.push(content.slice(startIdx, i.startIdx));
                    const importingContent = ctx.getResult(i.filepath);
                    slices.push(i.contentToInsert(importingContent));
                    startIdx = i.startIdx + i.length;
                }
                slices.push(content.slice(startIdx));
                return slices.join('');
            }
        }
    }
}

class CssImporter {
    async import(filepath, _) {
        const buffer = await FileUtils.readFile(filepath);
        /**@type string */
        const content = buffer.toString('utf-8');
        return {
            getContent: (_) => {
                return content;
            }
        }
    }
}

class BufferImporter {
    async import(filepath, _) {
        const buffer = await FileUtils.readFile(filepath);
        return {
            getContent: (_) => {
                return buffer;
            }
        }
    }
}

class ImportContext {
    constructor(workdir) {
        /**@type string[] */
        this.modules = [];
        /**@type string[] */
        this.results = {};
        /**@type Set<string> */
        this.dealingmodules = new Set();
        this.addedModules = new Set();
        this.workdir = workdir;
    }

    toImport(filename) {
        if (this.addedModules.has(filename)) {
            return;
        }
        this.addedModules.add(filename);
        this.modules.push(filename);
    }

    getResult(filename) {
        const result = this.results[filename];
        if (!result.content) {
            if (this.dealingmodules.has(filename)) {
                throw new Error('Cyclic dependencies');
            }
            this.dealingmodules.add(filename);
            result.content = result.getContent(this);
            this.dealingmodules.delete(filename);
        }
        return result.content;
    }
}

class Packer {

    getLoader( /**@type string */ filepath) {
        const ext = path.extname(filepath).toLocaleLowerCase();
        switch (ext) {
            case ".html":
                return new TextImporter(new HtmlCssAdaper(), new HtmlScriptAdaper());
            case ".js":
                return new TextImporter(new JsJsAdaper(), new JsPngAdaper());
            case ".css":
                return new TextImporter();
            case ".png":
                return new BufferImporter();
            default:
                throw new Error();
        }
    }

    getOutputFileName( /**@type string */ outputTemplate, meta) {
        return outputTemplate.replace('[name]', meta.name);
    }

    async pack(workdir, entries, outputDir, outputTemplate) {
        const entryModules = [];
        for (let name in entries) {
            entryModules.push({
                name,
                path: path.resolve(workdir, entries[name])
            });
        }

        const context = new ImportContext(workdir);
        const {
            modules,
            results
        } = context;
        modules.push(...entryModules.map(m => m.path));

        while (modules.length > 0) {
            const m = modules.shift();
            const importer = this.getLoader(m);
            results[m] = await importer.import(m, context);
        }
        for (let m of entryModules) {
            const packed = context.getResult(m.path);
            const output = path.join(outputDir, this.getOutputFileName(outputTemplate, {
                name: m.name
            }) + ".html");
            await FileUtils.writeFile(output, packed);
        }
    }
}

const main = async () => {
    const workdir = process.cwd();
    const defaultConfigFile = 'spack.config.js';
    const configPath = path.join(workdir, defaultConfigFile);
    /**@type { entries: string[], output: { path: string, filename: string } } */
    const config = await require(configPath);
    const packer = new Packer();
    await packer.pack(workdir, config.entries, config.output.path, config.output.filename);
}

main();