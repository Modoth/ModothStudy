import { Configs } from '../apis'

export default class ILangsService {
  public async load (langs?:{ [key:string]:string}) {
    throw new Error()
  }

  public get (name: Configs.UiLangsEnum | Configs.ServiceMessagesEnum | Configs.PermissionDescriptionsEnum): string {
    throw new Error()
  }
}
