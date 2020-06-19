import { Configs, ApiResult } from '../apis'

interface ApiResultG<T> extends ApiResult {
    data?: T;
}

export async function tryRun<Result> (func: () => Promise<ApiResultG<Result>>, onError:any = null): Promise<Result | undefined> {
  let res:ApiResultG<Result>
  try {
    res = await func()
  } catch (e) {
    console.log(e)
    if (onError) {
      onError(Configs.ServiceMessagesEnum.ServerError.toString())
      return undefined
    }
    throw new Error(Configs.ServiceMessagesEnum.ServerError.toString())
  }
  if (!res.result) {
    if (onError) {
      onError(res.error)
      return undefined
    }
    throw new Error(res.error)
  }
  return res.data!
}

export class ApiService<Api> {
  constructor (protected api: Api) {
  }

  protected async try<Result> (func: () => Promise<ApiResultG<Result>>): Promise<Result> {
    return (await tryRun(func))!
  }
}
