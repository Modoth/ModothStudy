/**@type function(Blob file):Promise<string> */
export const readFile = (file, type = 'Text') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.onabort = reject
    reader['readAs' + type](file)
  })
}
