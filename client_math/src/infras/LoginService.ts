import { LoginApi, LoginUser, Configs, ApiResult } from '../apis'
import ILoginService from '../app/ILoginService'
import { ApiService } from './ApiService'

export default class LoginService extends ApiService<LoginApi> implements ILoginService {
  constructor () {
    super(new LoginApi())
  }

  async logout (): Promise<any> {
    await this.try(() => this.api.off())
    this.user = undefined
  }

  async login (name: string, pwd: string): Promise<LoginUser | undefined> {
    this.user = await this.try(() => this.api.pwdOn({ name, password: pwd }))
    return this.user
  }

  async checkLogin (): Promise<LoginUser | undefined> {
    let user
    try {
      const res = await this.api.on()
      if (res.result) {
        user = res.data
      }
    } catch (e) {
      console.log(e)
    }
    this.user = user
    return this.user
  }

  private mUser?: LoginUser

  get user (): LoginUser | undefined {
    return this.mUser
  }

  set user (value) {
    this.mUser = value
    this.setUser && this.setUser(this.user)
  }

  setUser (_?:LoginUser) {
  }
}
