import { Configs } from '../apis'

export enum LangKeys {
  AddToArticleList = <any>'AddToArticleList',
  RemoveFromArticleList = <any>'RemoveFromArticleList',
}

export default class ILangsService {
  public async load(...langs: { [key: string]: string }[]) {
    throw new Error()
  }

  public get(name: LangKeys | Configs.UiLangsEnum | Configs.ServiceMessagesEnum | Configs.PermissionDescriptionsEnum): string {
    throw new Error()
  }
}
