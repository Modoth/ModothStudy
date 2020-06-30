import { LoginApi, LoginUser, Configs } from '../apis'
import ILoginService, { ILoginUser } from './ILoginService'
import { ApiService } from '../common/ApiService'
import ApiConfiguration from '../common/ApiConfiguration'

export default class LoginService extends ApiService<LoginApi> implements ILoginService {
  constructor() {
    super(new LoginApi(ApiConfiguration))
  }

  raiseUpdate() {
    this.user = this.user && { ...this.user }
  }

  async logout(direct?: boolean): Promise<any> {
    if (!direct) {
      await this.try(() => this.api.off())
    }
    this.user = undefined
  }

  async login(name: string, pwd: string): Promise<LoginUser | undefined> {
    this.user = await this.try(() => this.api.pwdOn({ name, password: pwd })) as ILoginUser
    return this.user
  }

  async checkLogin(): Promise<LoginUser | undefined> {
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

  get user(): ILoginUser | undefined {
    return this.mUser
  }

  set user(value) {
    this.mUser = value
    if (this.mUser) {
      this.mUser.managePermission = (value && value.permissions && value.permissions[Configs.PermissionDescriptionsEnum.MANAGE]) === true
      this.mUser.editPermission = (value && value.permissions && value.permissions[Configs.PermissionDescriptionsEnum.POSTBLOG]) === true
    }
    this.setUser && this.setUser(this.user)
  }

  setUser(_?: ILoginUser) {
  }
}
