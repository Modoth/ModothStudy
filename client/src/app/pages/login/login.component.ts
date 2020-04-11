import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AppService, ExplorerHistoryItem } from "src/app/services/app.service";
import { NotifyService } from "src/app/services/notify.service";
import {
  LoginUser,
  Configs,
  LoginService,
  ApiResultString,
} from "src/app/apis";
import { Subscription, throwError, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { isNullOrSpace } from "src/app/utils/util";
import {
  FileApiService,
  fileApiUrls,
} from "src/app/services/file_api_service/index";
import { ConfigsService } from "src/app/services/configs.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  public name = "";
  public pwd = "";
  public isLoading = false;
  public loginUser: LoginUser;
  public subscriptions: Subscription[] = [];
  public explorerHistory: ExplorerHistoryItem[];
  pwdReg: Observable<string>;

  public readonly pwdPopupConfig = [
    {
      label: Configs.UiLangsEnum.Password.toString(),
      type: "password",
      key: "oldPwd",
    },
    {
      label: Configs.UiLangsEnum.NewPassword.toString(),
      type: "password",
      key: "newPwd",
    },
    {
      label: Configs.UiLangsEnum.NewPassword.toString(),
      type: "password",
      key: "rePwd",
    },
  ];
  public readonly pwdPopupTitle = Configs.UiLangsEnum.ChangePwd.toString();
  public readonly pwdPopupSubTitle = Configs.UiLangsEnum.PwdDescription.toString();

  constructor(
    public appService: AppService,
    public notofyService: NotifyService,
    public loginApi: LoginService,
    public fileApiService: FileApiService,
    public configService: ConfigsService,
    public router: Router
  ) {}

  login = () => {
    if (isNullOrSpace(this.name) || isNullOrSpace(this.pwd)) return;
    const { name, pwd } = this;
    this.isLoading = true;
    this.pwd = "";
    this.appService.login(name, pwd).subscribe(
      (apiRes) => {
        this.isLoading = false;
        this.appService.navagateBackOrHome();
      },
      (error) => {
        this.isLoading = false;
        this.notofyService.toast(error);
      }
    );
  };

  clearHistory() {
    this.appService.clearExplorerHistory();
  }

  logout = () => {
    this.appService.logout().subscribe({
      error(er) {
        this.notofyService.toast(er);
      },
    });
  };

  onLoginUserChanged = (user) => {
    this.isLoading = false;
    this.loginUser = user;
    if (isNullOrSpace(user)) return;
    this.name = user.name;
  };

  changeNickNameSave(data) {
    const nickName = data.nickName;
    if (isNullOrSpace(nickName)) return;
    this.loginApi
      .updateNickName(nickName.trim())
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.loginUser.nickName = nickName;
        })
      )
      .subscribe({ error: (er) => this.notofyService.toast(er) });
  }

  changeAvatar(data) {
    if (isNullOrSpace(data)) return;
    this.fileApiService
      .fetch(fileApiUrls.Login_UpdateAvatar, { blob: data })
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.loginUser.avatar = apiRes.data;
        })
      )
      .subscribe({ error: (er) => this.notofyService.toast(er) });
  }

  changePwd(data: { oldPwd; newPwd; rePwd }) {
    this.configService
      .getConfig(Configs.AppConfigsEnum.PWDEXP)
      .subscribe((reg) => {
        if (!reg) {
          this.notofyService.toast(Configs.ServiceMessagesEnum.ClientError);
          return;
        }
        if (isNullOrSpace(data.oldPwd)) {
          this.notofyService.toast(Configs.ServiceMessagesEnum.UserOrPwdError);
          return;
        }
        if (data.rePwd !== data.newPwd) {
          this.notofyService.toast(Configs.UiLangsEnum.PasswordNotSame);
          return;
        }
        if (!new RegExp(reg).test(data.newPwd)) {
          this.notofyService.toast(Configs.UiLangsEnum.PwdDescription);
          return;
        }
        const newInfo = { password: data.newPwd, oldPassword: data.oldPwd };
        this.loginApi
          .updatePwd(newInfo)
          .pipe(
            tap((apiRes) => {
              if (!apiRes.result) throw apiRes.error;
              this.appService.clearLoginUser();
            })
          )
          .subscribe({ error: (er) => this.notofyService.toast(er) });
      });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.appService.loginUsers.subscribe(this.onLoginUserChanged)
    );
    this.subscriptions.push(
      this.appService.explorerHistory.subscribe(
        (his) => (this.explorerHistory = his)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
