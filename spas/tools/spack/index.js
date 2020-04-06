const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

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

    /**
 * 
 * @param {string} file 
 * @return { Stats }
 */
    static fileStat(file) {
        return new Promise((resolve, reject) => {
            fs.stat(file, (err, stats) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(stats)
                }
            })
        })
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
        let mtime = (await FileUtils.fileStat(filepath)).mtimeMs;

        /** @type string */
        const content = buffer.toString('utf-8');
        if (!(this.adapters && this.adapters.length > 0)) {
            return {
                mtime,
                data: content
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
            lazyGetResult: async (ctx) => {
                let startIdx = 0;
                let slices = [];
                for (let i of moduleInfos) {
                    slices.push(content.slice(startIdx, i.startIdx));
                    const result = await ctx.getResult(i.filepath);
                    slices.push(i.contentToInsert(result.data));
                    startIdx = i.startIdx + i.length;
                    if (result.mtime > mtime) {
                        mtime = result.mtime;
                    }
                }
                slices.push(content.slice(startIdx));
                let data = slices.join('');
                return { mtime, data };
            }
        }
    }
}

class CssImporter {
    async import(filepath, _) {
        const buffer = await FileUtils.readFile(filepath);
        const mtime = (await FileUtils.fileStat(i.filepath)).mtimeMs;
        /**@type string */
        const data = buffer.toString('utf-8');
        return {
            lazyGetResult: (_) => {
                return {
                    mtime,
                    data
                };
            }
        }
    }
}

class BufferImporter {
    async import(filepath, _) {
        const data = await FileUtils.readFile(filepath);
        const mtime = (await FileUtils.fileStat(filepath)).mtimeMs;
        return {
            lazyGetResult: (_) => {
                return {
                    mtime,
                    data
                };
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

    async getResult(filename) {
        const result = this.results[filename];
        if (!result.data) {
            if (this.dealingmodules.has(filename)) {
                throw new Error('Cyclic dependencies');
            }
            this.dealingmodules.add(filename);
            let { data, mtime } = await result.lazyGetResult(this);
            result.data = data;
            result.mtime = mtime;
            this.dealingmodules.delete(filename);
        }
        return result;
    }
}

class Packer {

    constructor(cd) {
        this.cdConfig = cd;
    }

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
                path: path.resolve(workdir, entries[name].path)
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
        let apiClient;
        if (entryModules.some(m => entries[m.name].blogPath)) {
            let client = new Client(this.cdConfig.url, { acceptUnauthorized: this.cdConfig.acceptUnauthorized });
            apiClient = !client.invalidUrl
                && (await client.login(this.cdConfig.name, this.cdConfig.password))
                && client;
        }
        for (let m of entryModules) {
            const packed = await context.getResult(m.path);
            const output = path.join(outputDir, this.getOutputFileName(outputTemplate, {
                name: m.name
            }) + ".html");
            if (!await FileUtils.exists(output) || (await FileUtils.fileStat(output)).mtimeMs < packed.mtime) {
                if (entries[m.name].blogPath) {
                    if (!apiClient || !await apiClient.createOrUpdateBlog(entries[m.name].blogPath, packed.data)) {
                        console.log(`${m.name}: Failed`)
                        continue;
                    }
                    console.log(`${m.name}: Success`)
                }
                await FileUtils.writeFile(output, packed.data);
                console.log(`${m.name}: Success to Save`)
            } else {
                console.log(`${m.name}: No Change`)
            }
        }
    }
}

class Client {
    constructor(baseUrl, { acceptUnauthorized }) {
        this.baseUrl = baseUrl;
        this.invalidUrl = false;
        this.nodesDict = {};
        this.acceptUnauthorized = acceptUnauthorized;
        if (!this.baseUrl) {
            this.invalidUrl = true;
            return;
        }
        this.request = this.baseUrl.toLocaleLowerCase().startsWith("https") ?
            https.request : http.request;
    }

    get(url) {
        return new Promise(resolve => {
            let req = this.request(`${this.baseUrl}${url}`, {
                method: "GET",
                headers: {
                    "Cookie": this.sessionCookie || ''
                },
                rejectUnauthorized: !this.acceptUnauthorized,
            }, res => {
                this.registerResWithResolve(res, resolve);
            })
            req.on('error', (e) => {
                resolve(null);
            });
            req.end();
        })
    }

    registerResWithResolve(res, resolve) {
        if (res.statusCode !== 200) {
            resolve(null);
        }
        res.setEncoding('utf8');
        let apiRes = null;
        res.on('data', (chunk) => {
            try {
                apiRes = JSON.parse(chunk);
            }
            catch{
                //ignore
            }
        });
        res.on('end', () => {
            if (apiRes) {
                apiRes.headers = res.headers;
            }
            resolve(apiRes);
        });
    }

    postOrPut(url, data, type) {
        return new Promise(resolve => {
            const jsonData = JSON.stringify(data);

            let req = this.request(`${this.baseUrl}${url}`, {
                method: type,
                json: true,
                rejectUnauthorized: !this.acceptUnauthorized,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(jsonData),
                    "Cookie": this.sessionCookie || ''
                }
            }, (res) => {
                this.registerResWithResolve(res, resolve);
            });

            req.on('error', (e) => {
                resolve(null);
            });
            req.write(jsonData);
            req.end();
        })
    }

    post(url, data) {
        return this.postOrPut(url, data, "POST");
    }

    put(url, data) {
        return this.postOrPut(url, data, "PUT");
    }

    async login(name, password) {
        if (!name || !password) {
            this.invalidUrl = true;
            return null;
        }
        let apiRes = await this.post(`/api/Login/PwdOn`, { name, password });
        if (apiRes && apiRes.result) {
            for (let cookieStr of apiRes.headers["set-cookie"]) {
                let cookies = cookieStr.split(';').map(c => c.trim());
                let sessionCookie = cookies.find(c => c.startsWith('.AspNetCore.Session='));
                if (sessionCookie) {
                    this.sessionCookie = sessionCookie;
                    break
                }
            }
        }
        this.rootPath = `/${name}`;
        return this.sessionCookie;
    }


    async createOrUpdateBlog(blogPath, content) {
        let res = await this.put(`/api/Nodes/CreateOrUpdateBlogContent?path=${blogPath}`, content);
        return res && res.result
    }
}

const main = async () => {
    const workdir = process.cwd();
    const defaultConfigFile = 'spack.config.js';
    const configPath = path.join(workdir, defaultConfigFile);
    /**@type { entries: string[], output: { path: string, filename: string } } */
    const config = await require(configPath);
    const packer = new Packer(config.cd);
    await packer.pack(workdir, config.entries, config.output.path, config.output.filename);
}

main();