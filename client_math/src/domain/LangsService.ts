import { Configs, ConfigsApi } from '../apis'
import ILangsService, { LangKeys } from './ILangsService'
import ApiConfiguration from '../common/ApiConfiguration'

export default class LangsService implements ILangsService {
  private langs: { [key: string]: string }
  public async load(...langs: { [key: string]: string }[]) {
    const api = new ConfigsApi(ApiConfiguration)
    const remoteLangs = await api.all()
    if (langs) {
      this.langs = Object.assign({}, remoteLangs, ...langs)
    } else {
      this.langs = remoteLangs
    }
  }

  public get(name: LangKeys | Configs.UiLangsEnum | Configs.ServiceMessagesEnum | Configs.PermissionDescriptionsEnum): string {
    const key = name.toString()
    return this.langs[key] || key
  }
}
