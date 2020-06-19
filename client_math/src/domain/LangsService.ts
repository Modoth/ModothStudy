import { Configs, ConfigsApi } from '../apis'

export default class LangsService {
  private langs: { [key:string]:string}
  public async load () {
    const api = new ConfigsApi()
    this.langs = await api.all()
  }

  public get (name: Configs.UiLangsEnum | Configs.ServiceMessagesEnum | Configs.PermissionDescriptionsEnum): string {
    const key = name.toString()
    return this.langs[key] || key
  }
}
