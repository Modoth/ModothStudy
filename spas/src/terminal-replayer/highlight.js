export const highlight = (/**@type string */ content) => {
  const results = []
  const lines = content.split('\n')
  let prefix
  for (let line of lines) {
    let match = line.match(/^([\$#]|(?:PS.*?>)|(?:>>>)|(?:>))(\s+)(\w+)?(.*)$/)
    if (!match) {
      results.push(line)
      continue
    }
    prefix = `\\033[34m${match[1]}\\033[0m${match[2]}\\033[5m`
    line = `${prefix}\\033[32m${match[3] || ''}\\033[0m${match[4]}\\033[25m`
    line = line.replace(/(\$\w*)/g, (s) => `\\033[31m${s}\\033[0m`)
    results.push(line)
  }
  prefix && results.push(prefix)
  return results.join('\n')
}
