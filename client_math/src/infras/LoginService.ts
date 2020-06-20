import { LoginApi, LoginUser, Configs } from '../apis'
import ILoginService, { ILoginUser } from '../app/ILoginService'
import { ApiService } from './ApiService'

export default class LoginService extends ApiService<LoginApi> implements ILoginService {
  constructor () {
    super(new LoginApi())
  }

  raiseUpdate () {
    this.user = this.user && { ...this.user }
  }

  async logout (): Promise<any> {
    await this.try(() => this.api.off())
    this.user = undefined
  }

  async login (name: string, pwd: string): Promise<LoginUser | undefined> {
    this.user = await this.try(() => this.api.pwdOn({ name, password: pwd })) as ILoginUser
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
    this.user = user as ILoginUser
    return this.user
  }

  private mUser?: ILoginUser

  get user (): ILoginUser | undefined {
    return this.mUser
  }

  set user (value) {
    this.mUser = value
    if (this.mUser) {
      this.mUser.managePermission = (value && value.permissions && value.permissions[Configs.PermissionDescriptionsEnum.MANAGE]) === true
    }
    this.setUser && this.setUser(this.user)
  }

  setUser (_?:ILoginUser) {
  }
}
