import LangsService from '../domain/LangsService'

export default interface INotifyService{
    setLoading(loading: boolean): void
    error(msg:string, timeout?: number):void
    errorKey(langs: LangsService, key:any, timeout?: number):void
}
