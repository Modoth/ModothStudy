import { LoginUser } from '../apis'

export default interface ILoginService {
    login(name: string, pwd: string): Promise<LoginUser|undefined>;
    checkLogin(): Promise<LoginUser | undefined>;
    logout(): Promise<any>;
    readonly user: LoginUser|undefined;
}
