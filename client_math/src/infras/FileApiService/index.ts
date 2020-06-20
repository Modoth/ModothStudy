import { ApiResultString, Configs } from '../../apis'
import { RequestMethod } from './RequestMethod'
import FileApiUrls from './FileApiUrls'

class FileApiService {
  public _getFetchUrl (url: string, params?: object): string {
    if (!params) return url
    const paramsArr = []
    for (const [key, value] of Object.entries(params)) {
      paramsArr.push(`${key}=${value}`)
    }
    return url + '?' + paramsArr.join('&')
  }

  public async fetch (
    urlObj: { url: string; method: RequestMethod },
    params: { blob: Blob; search?: object }
  ): Promise<string> {
    const { url, method } = urlObj
    const { blob, search } = params
    const fd = new FormData()
    fd.append('file', blob)
    let res:ApiResultString
    try {
      res = await (await fetch(this._getFetchUrl(url, search), {
        method,
        body: fd
      })).json() as ApiResultString
    } catch (e) {
      throw new Error(Configs.ServiceMessagesEnum.ClientError.toString())
    }
    if (!res.result) {
      throw new Error(res.error)
    }
    return res.data!
  }
}

export { FileApiService, FileApiUrls }
