import { message } from 'antd'
import INotifyService from '../app/INotifyService'

export default class NotifyService implements INotifyService {
  errorKey (langs: import('../domain/LangsService').default, key: any, timeout?: number | undefined): void {
    this.error(langs.get(key), timeout)
  }

  error (msg: string, timeout: number = 1000): void {
    message.error(msg, timeout / 1000)
  }

  setLoading (_: boolean) {
    throw new Error('Need injected from components!')
  }
}
