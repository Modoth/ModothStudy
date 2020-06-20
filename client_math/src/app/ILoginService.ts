import { LoginUser } from '../apis'

export interface ILoginUser extends LoginUser{
    managePermission: boolean
}

export default interface ILoginService {
    login(name: string, pwd: string): Promise<LoginUser|undefined>;
    checkLogin(): Promise<LoginUser | undefined>;
    logout(): Promise<any>;
    raiseUpdate() : any;
    readonly user: ILoginUser|undefined;
}
