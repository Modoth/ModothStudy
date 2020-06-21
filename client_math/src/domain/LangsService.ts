import { Configs, ConfigsApi } from '../apis'
import ILangsService from './ILangsService'

export default class LangsService implements ILangsService {
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
