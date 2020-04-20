const path = require('path')
const fs = require('fs')
const http = require('http')
const { Socket } = require('net')
const https = require('https')
const crypto = require('crypto')

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
          resolve(data)
        }
      })
    })
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
    return new Promise((resolve) => {
      fs.exists(file, resolve)
    })
  }

  static mkdir(dir) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  static async createPaths(dir) {
    if (await FileUtils.exists(dir)) {
      return
    }
    const parent = path.dirname(dir)
    if (!(await FileUtils.exists(parent))) {
      await FileUtils.createPaths(parent)
    }
    await FileUtils.mkdir(dir)
  }

  static async writeFile(filepath, content) {
    await FileUtils.createPaths(path.dirname(filepath))
    return await new Promise((resolve, reject) => {
      fs.writeFile(filepath, content, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

class ImporterUtils {
  static getModuleInfos(
    /** @type string */ content,
    /**@type RegExp */ reg,
    contentToInsert
  ) {
    const moduleInfos = []
    while (true) {
      const match = reg.exec(content)
      if (!match) {
        break
      }
      moduleInfos.push({
        startIdx: match.index,
        length: match[0].length,
        filename: match[1],
        contentToInsert,
      })
    }
    return moduleInfos
  }
}

class HtmlScriptAdaper {
  constructor() {
    this.reg = /<script[^>]+src="([^">]*)"[^>]*>\s*<\/script>/gm
  }
  convert(content) {
    return `<script>\n${content}\n</script>`
  }
}

class HtmlCssAdaper {
  constructor() {
    this.reg = /<link rel="stylesheet" type="text\/css" href="([^"]*\.css)">/gm
  }
  convert(content) {
    return `<style>\n${content}\n</style>`
  }
}

class JsPngAdaper {
  constructor() {
    this.reg = /\/\*\*\s*@imports image\s*\*\/ '([^']*)'/gm
  }
  convert(content) {
    return `'data:image/png;base64,${content.toString('base64')}'`
  }
}

class JsHtmlAdaper {
  constructor() {
    this.reg = /\/\*\*\s*@imports html\s*\*\/ '([^']*)'/gm
  }
  convert(content) {
    return `(()=>{
      const root = document.createElement('div')
      const shadow = root.attachShadow({mode:"closed"})
      shadow.innerHTML = ${JSON.stringify(content)}
      return root
    })()`
  }
}

class JsCssAdaper {
  constructor() {
    this.reg = /\/\*\*\s*@imports css\s*\*\/ '([^']*)'/gm
  }
  convert(content) {
    return `(()=>{
      const style = document.createElement('style')
      style.innerHTML = ${JSON.stringify(content)}
      return style
    })()`
  }
}

class JsJsAdaper {
  constructor() {
    this.reg = /^import(?:.*\s*)*?.*from.*'(.*)'/gm
  }
  convert(content) {
    content = content.replace(/^\s*export\s*/g, '\n')
    content = content.replace(/\n\s*export\s*/g, '\n')
    return content
  }
}

class TextImporter {
  constructor(
    /**@type {reg : RegExp, convert:(any) => string }[] */ ...adapters
  ) {
    this.adapters = adapters
  }

  async import(filepath, context) {
    const buffer = await FileUtils.readFile(filepath)
    let mtime = (await FileUtils.fileStat(filepath)).mtimeMs

    /** @type string */
    const content = buffer.toString('utf-8')
    if (!(this.adapters && this.adapters.length > 0)) {
      return {
        mtime,
        data: content,
      }
    }
    let moduleInfos = []
    moduleInfos = this.adapters
      .map((a) => ImporterUtils.getModuleInfos(content, a.reg, a.convert))
      .reduce((r, i) => r.concat(i), [])
      .sort((a, b) => a.startIdx - b.startIdx)

    moduleInfos.forEach((i) => {
      i.filepath = path.resolve(filepath, '..', i.filename)
      context.toImport(i.filepath, filepath)
    })
    return {
      lazyGetResult: async (ctx) => {
        let startIdx = 0
        let slices = []
        for (let i of moduleInfos) {
          slices.push(content.slice(startIdx, i.startIdx))
          const result = await ctx.getResult(i.filepath)
          slices.push(i.contentToInsert(result.data))
          startIdx = i.startIdx + i.length
          if (result.mtime > mtime) {
            mtime = result.mtime
          }
        }
        slices.push(content.slice(startIdx))
        let data = slices.join('')
        return { mtime, data }
      },
    }
  }
}

class CssImporter {
  async import(filepath, _) {
    const buffer = await FileUtils.readFile(filepath)
    const mtime = (await FileUtils.fileStat(i.filepath)).mtimeMs
    /**@type string */
    const data = buffer.toString('utf-8')
    return {
      lazyGetResult: (_) => {
        return {
          mtime,
          data,
        }
      },
    }
  }
}

class BufferImporter {
  async import(filepath, _) {
    const data = await FileUtils.readFile(filepath)
    const mtime = (await FileUtils.fileStat(filepath)).mtimeMs
    return {
      lazyGetResult: (_) => {
        return {
          mtime,
          data,
        }
      },
    }
  }
}

class ImportContext {
  constructor(workdir) {
    /**@type string[] */
    this.modules = []
    /**@type string[] */
    this.results = {}
    /**@type Set<string> */
    this.dealingmodules = new Set()
    this.addedModules = new Set()
    this.workdir = workdir
    this.dependentedBys = {}
  }

  toImport(filename, dependentedBy) {
    this.dependentedBys[filename] =
      this.dependentedBys[filename] || new Set([filename])
    if (dependentedBy) {
      this.dependentedBys[dependentedBy] =
        this.dependentedBys[dependentedBy] || new Set([dependentedBy])
      for (const dep of this.dependentedBys[dependentedBy].keys()) {
        this.dependentedBys[filename].add(dep)
      }
    }
    if (this.addedModules.has(filename)) {
      return
    }
    this.addedModules.add(filename)
    this.modules.push(filename)
  }

  async getResult(filename) {
    const result = this.results[filename]
    if (!result.data) {
      if (this.dealingmodules.has(filename)) {
        throw new Error('Cyclic dependencies')
      }
      this.dealingmodules.add(filename)
      let { data, mtime } = await result.lazyGetResult(this)
      result.data = data
      result.mtime = mtime
      this.dealingmodules.delete(filename)
    }
    return result
  }
}

class Packer {
  getLoader(/**@type string */ filepath) {
    const ext = path.extname(filepath).toLocaleLowerCase()
    switch (ext) {
      case '.html':
        return new TextImporter(new HtmlCssAdaper(), new HtmlScriptAdaper())
      case '.js':
        return new TextImporter(
          new JsJsAdaper(),
          new JsHtmlAdaper(),
          new JsCssAdaper(),
          new JsPngAdaper()
        )
      case '.css':
        return new TextImporter()
      case '.png':
        return new BufferImporter()
      default:
        throw new Error()
    }
  }

  getOutputFileName(/**@type string */ outputTemplate, meta) {
    return outputTemplate.replace('[name]', meta.name)
  }

  async packOnce(workdir, entries, outputTemplate) {
    const entryModules = []
    for (let name in entries) {
      entryModules.push({
        name,
        path: path.resolve(workdir, entries[name].path),
        templatePath:
          entries[name].template &&
          path.resolve(workdir, entries[name].template),
      })
    }
    const results = {}
    const context = new ImportContext(workdir)
    const { modules } = context
    entryModules.forEach((m) => {
      context.toImport(m.path)
      m.templatePath && context.toImport(m.templatePath, m.path)
    })
    while (modules.length > 0) {
      const m = modules.shift()
      const importer = this.getLoader(m)
      context.results[m] = await importer.import(m, context)
    }
    for (let m of entryModules) {
      const result = await context.getResult(m.path)
      if (m.templatePath) {
        const template = await context.getResult(m.templatePath)
        result.data = `<script>\n${result.data}</script>\n${template.data}`
        result.mtime = Math.max(result.mtime, template.mtime)
      }
      result.output =
        this.getOutputFileName(outputTemplate, {
          name: m.name,
        }) + '.html'
      results[m.name] = result
    }
    return { results, dependentedBys: context.dependentedBys }
  }

  async checkFileChanges() {
    return false
  }

  async pack(workdir, entries, outputTemplate, onchange = null) {
    const { results, dependentedBys } = await this.packOnce(
      workdir,
      entries,
      outputTemplate
    )
    const watchers = new Map()
    const contentChangedDeps = new Set()
    if (onchange) {
      ;(async () => {
        while (true) {
          contentChangedDeps.clear()
          const newDeps = new Set(Object.keys(dependentedBys))
          const wathedDeps = Array.from(watchers.keys())
          for (const dep of wathedDeps) {
            if (dependentedBys[dep]) {
              newDeps.delete(dep)
            } else {
              watchers.get(dep).removeAllListeners()
              watchers.delete(dep)
            }
          }
          for (const dep of newDeps.keys()) {
            const watcher = fs.watch(dep, (event) => {
              if (event !== 'change') {
                return
              }
              for (const file of dependentedBys[dep]) {
                contentChangedDeps.add(file)
              }
              watchers.delete(dep)
              watcher.removeAllListeners()
            })
            watchers.set(dep, watcher)
          }
          while (!contentChangedDeps.size) {
            await new Promise((r) => setTimeout(r, 1000))
          }
          console.log('Start\n============')
          const toUpdateEntries = {}
          for (const name in entries) {
            const entry = entries[name]
            if (contentChangedDeps.has(entry.path)) {
              toUpdateEntries[name] = entry
              for (const dep of contentChangedDeps) {
                dependentedBys[dep].delete(name)
                if (!dependentedBys[dep].size) {
                  delete dependentedBys[dep]
                }
              }
            }
          }
          const {
            results,
            dependentedBys: newDependentedBys,
          } = await this.packOnce(workdir, toUpdateEntries, outputTemplate)
          console.log('============\nend\n')
          onchange(results)
          for (const dep in newDependentedBys) {
            if (!dependentedBys[dep]) {
              dependentedBys[dep] = newDependentedBys[dep]
            } else {
              for (const deped of newDependentedBys[dep]) {
                dependentedBys[dep].add(deped)
              }
            }
          }
        }
      })()
    }
    return results
  }
}

class Publisher {
  constructor(cd) {
    this.cdConfig = cd
  }
  async publish(entries, results, outputDir) {
    let apiClient
    if (entries.some((m) => m.blogPath)) {
      let client = new Client(this.cdConfig.url, {
        acceptUnauthorized: this.cdConfig.acceptUnauthorized,
      })
      apiClient =
        !client.invalidUrl &&
        (await client.login(this.cdConfig.name, this.cdConfig.password)) &&
        client
    }
    for (let entry of entries) {
      const result = results[entry.name]
      const output = path.join(outputDir, result.output)
      if (
        !(await FileUtils.exists(output)) ||
        (await FileUtils.fileStat(output)).mtimeMs < result.mtime
      ) {
        if (entry.blogPath) {
          if (
            !apiClient ||
            !(await apiClient.createOrUpdateBlog(entry.blogPath, result.data))
          ) {
            console.log(`${entry.name}: Failed`)
            continue
          }
          console.log(`${entry.name}: Success`)
        }
        await FileUtils.writeFile(output, result.data)
        console.log(`${entry.name}: Success to Save`)
      } else {
        console.log(`${entry.name}: No Change`)
      }
    }
  }
}

class Client {
  constructor(baseUrl, { acceptUnauthorized }) {
    this.baseUrl = baseUrl
    this.invalidUrl = false
    this.nodesDict = {}
    this.acceptUnauthorized = acceptUnauthorized
    if (!this.baseUrl) {
      this.invalidUrl = true
      return
    }
    this.request = this.baseUrl.toLocaleLowerCase().startsWith('https')
      ? https.request
      : http.request
  }

  get(url) {
    return new Promise((resolve) => {
      let req = this.request(
        `${this.baseUrl}${url}`,
        {
          method: 'GET',
          headers: {
            Cookie: this.sessionCookie || '',
          },
          rejectUnauthorized: !this.acceptUnauthorized,
        },
        (res) => {
          this.registerResWithResolve(res, resolve)
        }
      )
      req.on('error', (e) => {
        resolve(null)
      })
      req.end()
    })
  }

  registerResWithResolve(res, resolve) {
    if (res.statusCode !== 200) {
      resolve(null)
    }
    res.setEncoding('utf8')
    let apiRes = null
    res.on('data', (chunk) => {
      try {
        apiRes = JSON.parse(chunk)
      } catch {
        //ignore
      }
    })
    res.on('end', () => {
      if (apiRes) {
        apiRes.headers = res.headers
      }
      resolve(apiRes)
    })
  }

  postOrPut(url, data, type) {
    return new Promise((resolve) => {
      const jsonData = JSON.stringify(data)

      let req = this.request(
        `${this.baseUrl}${url}`,
        {
          method: type,
          json: true,
          rejectUnauthorized: !this.acceptUnauthorized,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonData),
            Cookie: this.sessionCookie || '',
          },
        },
        (res) => {
          this.registerResWithResolve(res, resolve)
        }
      )

      req.on('error', (e) => {
        resolve(null)
      })
      req.write(jsonData)
      req.end()
    })
  }

  post(url, data) {
    return this.postOrPut(url, data, 'POST')
  }

  put(url, data) {
    return this.postOrPut(url, data, 'PUT')
  }

  async login(name, password) {
    if (!name || !password) {
      this.invalidUrl = true
      return null
    }
    let apiRes = await this.post(`/api/Login/PwdOn`, { name, password })
    if (apiRes && apiRes.result) {
      for (let cookieStr of apiRes.headers['set-cookie']) {
        let cookies = cookieStr.split(';').map((c) => c.trim())
        let sessionCookie = cookies.find((c) =>
          c.startsWith('.AspNetCore.Session=')
        )
        if (sessionCookie) {
          this.sessionCookie = sessionCookie
          break
        }
      }
    }
    this.rootPath = `/${name}`
    return this.sessionCookie
  }

  async createOrUpdateBlog(blogPath, content) {
    let res = await this.put(
      `/api/Nodes/CreateOrUpdateBlogContent?path=${blogPath}`,
      content
    )
    return res && res.result
  }
}

class Server {
  async updateResult(results) {
    Object.assign(this.results, results)
    for (const file in results) {
      /**@type Socket */
      const socket = this.mWatchedSockets.get(file)
      if (socket) {
        socket.write(this.encodeWsData('update'))
      }
    }
  }

  resFile(res, name) {
    res.setHeader('content-type', 'text/html')
    if (this.results[name]) {
      res.write(this.results[name].data + this.getInjectScript(name) || '')
    } else {
      this.resNotFound(res)
    }
  }

  resList(res) {
    res.setHeader('content-type', 'text/html')
    res.write(
      '<ul>' +
        this.entries
          .map((e) => `<li><a href="/${e.name}">${e.name}</a></li>`)
          .join('') +
        '</ul>'
    )
  }

  resNotFound(res) {
    res.statusCode = 404
    res.write('404')
  }

  resJson(res, data, statusCode = 200) {
    res.statusCode = statusCode
    res.write(JSON.stringify(data))
  }

  resApi(res, api, ...param) {
    res.setHeader('content-type', 'application/json')
    switch (api) {
      default:
        return this.resJson(res, { error: true }, 404)
    }
  }

  encodeWsData(payload, opcode = 1) {
    if (opcode !== 0xa) {
      payload = new TextEncoder('utf-8').encode(payload)
    }
    const length = payload.length
    if (length >= 126) {
      throw 'Not Support.'
    }
    const data = new Uint8Array(2 + length)
    data[0] = 0b10000000 | (opcode & 0b1111111)
    data[1] = length
    for (let i = 0; i < length; i++) {
      data[i + 2] = payload[i]
    }
    return data
  }

  decodeWsData(/**@type Buffer*/ data) {
    const fin = data[0] >>> 7
    if (!fin) {
      return
    }
    const opcode = data[0] & 0b1111
    if (opcode !== 1 && opcode !== 0x9) {
      return { opcode }
    }
    const hasMask = data[1] >>> 7
    if (hasMask !== 1) {
      return
    }
    const len = data[1] & 0b1111111
    if (len >= 126) {
      return
    }
    const masks = data.slice(2, 6)
    const payload = data.slice(6)
    if (payload.length !== len) {
      return
    }
    for (let i = 0; i < len; i++) {
      payload[i] ^= masks[i % 4]
    }
    return {
      opcode,
      payload:
        opcode === 1 ? new TextDecoder('utf-8').decode(payload) : payload,
    }
  }

  resWebSocket(req, res) {
    /**@type Socket */
    const socket = res.socket
    req.socket.on('data', (data) => {
      const { opcode, payload } = this.decodeWsData(data)
      if (opcode === 0x8) {
        console.log('ws close by client')
        const file = this.mWatchedFiles.get(socket)
        if (file) {
          this.mWatchedFiles.delete(socket)
          this.mWatchedSockets.delete(file)
        }
        res.end()
      }
      if (payload === undefined) {
        socket.write(this.encodeWsData('Not Support.'))
        return
      }
      if (opcode === 0x9) {
        console.log('ping!')
        socket.write(this.encodeWsData(payload, opcode))
        return
      }
      console.log(`ws received payload`)
      const msgs = payload.split(':')
      const cmd = msgs[0]
      const file = msgs[1]
      switch (cmd) {
        case 'watch':
          console.log(`watch ${file}`)
          this.mWatchedFiles.set(socket, file)
          this.mWatchedSockets.set(file, socket)
          socket.write(this.encodeWsData(`watch ${file}`))
          return
        default:
          socket.write(this.encodeWsData('404'))
          return
      }
    })
    const key = req.headers['sec-websocket-key']
    const magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
    const accept = crypto
      .createHash('sha1')
      .update(key + magic)
      .digest('base64')
    const headers = `HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Sec-WebSocket-Accept: ${accept}
Connection: Upgrade

`
    socket.write(headers)
    console.log('ws connected')
  }

  async serve(/**@type any[] */ entries, results) {
    const port = 9080
    const hostname = 'localhost'
    this.results = results
    this.entries = entries
    this.mWatchedFiles = new Map()
    this.mWatchedSockets = new Map()
    this.getInjectScript = (name) => `
<script>
  const ws = new WebSocket('ws://${hostname}:${port}')
  ws.onopen = async ()=> {
    console.log('ws connected')
    ws.send('watch:${name}')
    while(true){
      await new Promise(r => setTimeout(r, 10000))
      ws.send('watch:${name}')
    }
  }
  ws.onmessage = ({data}) => {
    console.log('ws received %s', data)
    data === 'update' && window.location.reload()
  }
</script>
`
    this.connections = {}
    const apiPrefix = '/api/'
    const httpServer = http.createServer((req, res) => {
      if (
        req.headers['connection'] === 'Upgrade' &&
        req.headers['upgrade'] === 'websocket'
      ) {
        this.resWebSocket(req, res)
        return
      }
      console.log(req.url)
      if (!req.url || req.url === '/') {
        this.resList(res)
      } else if (req.url.startsWith(apiPrefix)) {
        const tokens = req.url
          .slice(apiPrefix.length)
          .split('/')
          .map((s) => s.trim())
          .filter((s) => s)
        this.resApi(res, ...tokens)
      } else {
        this.resFile(res, req.url.replace(/^\//, ''))
      }
      res.end()
    })
    httpServer.listen(port, hostname)
  }
}

const cmds = {
  publish: 'publish',
  serve: 'serve',
}

const main = async () => {
  const workdir = process.cwd()
  const cmd = process.argv[2] || cmds.publish
  const options = new Set(process.argv.slice(3))
  const defaultConfigFile = 'spack.config.js'
  const configPath = path.join(workdir, defaultConfigFile)
  /**@type { entries: string[], output: { path: string, filename: string } } */
  const config = await require(configPath)
  const packer = new Packer(config.cd)
  const entries = Object.keys(config.entries).map((name) =>
    Object.assign({ name }, config.entries[name])
  )
  switch (cmd) {
    case cmds.publish:
      await new Publisher(config.cd).publish(
        entries,
        await packer.pack(workdir, config.entries, config.output.filename),
        config.output.path
      )
      return
    case cmds.serve:
      const watch = options.has('--watch')
      const server = new Server()
      await server.serve(
        entries,
        await packer.pack(
          workdir,
          config.entries,
          config.output.filename,
          watch && server.updateResult.bind(server)
        )
      )
      return
  }
}

main()
