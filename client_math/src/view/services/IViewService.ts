import ILangsService from '../../domain/ILangsService'

export interface IPromptField<TValue, TType extends 'Text' | 'Password' | 'File' | 'Image' | 'TextFile' | 'Video' >{
  type : TType;
  hint?: string;
  value:TValue;
  icon?: React.ReactNode
  accept?: string;
}

export default class IViewService {
  setLoading (loading: boolean): void {
    throw new Error('Method not implemented.')
  }

  error (msg: string, timeout?: number | undefined): void {
    throw new Error('Method not implemented.')
  }

  errorKey (langs: ILangsService, key: any, timeout?: number | undefined): void {
    throw new Error('Method not implemented.')
  }

  prompt (title:string, fields: IPromptField<any, any>[], onOk: (...paras:any)=>Promise<boolean|undefined>):void{
    throw new Error('Method not implemented.')
  }
}
