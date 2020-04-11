import { Injectable, Inject, Optional } from "@angular/core";
import { Observable, BehaviorSubject, throwError, timer } from "rxjs";
import { distinctUntilChanged, tap, map } from "rxjs/operators";
import {
  LoginService,
  LoginUser,
  ApiResultLoginUser,
  Query,
  ApiResult,
  BASE_PATH,
} from "../apis";
import { Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
import { Configs } from "../apis";

export class MenuConfig {
  public defaultLink: string;
  constructor(
    public name: string,
    public topQuery: string,
    public query: Query,
    public children: MenuConfig[]
  ) {}
}

export class ExplorerHistoryItem {
  public id: string;
  public title: string;
  public date: Date;
}

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor(
    public loginService: LoginService,
    @Optional() @Inject(BASE_PATH) basePath: string,
    private router: Router,
    private location: Location
  ) {
    this.m_CanLogin = !this.isCorsApi(basePath, window.location.origin);
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.historyNo++;
      }
    });
  }

  private isCorsApi(apiBasePath, origin) {
    if (!apiBasePath) {
      return false;
    }
    apiBasePath = apiBasePath.trim().toLocaleUpperCase();
    origin = origin.toLocaleUpperCase();
    if (apiBasePath == "") {
      return false;
    }
    if (apiBasePath == origin || apiBasePath.startsWith(origin + "/")) {
      return false;
    }
    return true;
  }

  public navagateBackOrHome = () => {
    if (this.historyNo > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/");
    }
  };

  private historyNo = 0;
  private m_CanLogin = false;
  public get canLogin() {
    return this.m_CanLogin;
  }
  public readonly ExplorerHistoryKey = "ExplorerHistory";
  public readonly ThemeKey = "ThemeHistory";
  public explorerHistorySubject: BehaviorSubject<ExplorerHistoryItem[]>;
  public readonly MaxExplorerHistoryCount = 30;
  public currentThemeIdx = -1;
  public readonly themes = [
    "theme-purple-green",
    "theme-pink-bluegrey",
    "theme-deeppurple-amber",
    "theme-indigo-pink",
  ];

  public init() {
    this.explorerHistorySubject = new BehaviorSubject<ExplorerHistoryItem[]>(
      this.loadExploryHistory()
    );
    const theme = localStorage.getItem(this.ThemeKey);
    if (theme) {
      this.currentThemeIdx = this.themes.indexOf(theme);
    }
    this.updateTheme();
  }

  public loadExploryHistory() {
    const hisStr = localStorage.getItem(this.ExplorerHistoryKey);
    if (hisStr == null || hisStr === "") {
      return [];
    }
    try {
      const history = JSON.parse(hisStr);
      if (history.length > 0) {
        return history;
      }
      return [];
    } catch {
      return [];
    }
  }

  get loginUsers(): Observable<LoginUser> {
    return this.loginUsersSubject.pipe(distinctUntilChanged());
  }

  clearLoginUser() {
    this.loginUsersSubject.next(null);
  }

  get navbarVisibility(): Observable<boolean> {
    return this.navbarVisibilitySubject;
  }

  public changeNavbarVisibility(vis: boolean) {
    this.navbarVisibilitySubject.next(vis);
  }

  get explorerHistory(): Observable<ExplorerHistoryItem[]> {
    return this.explorerHistorySubject;
  }

  public clearExplorerHistory() {
    localStorage.setItem(this.ExplorerHistoryKey, "");
    this.explorerHistorySubject.next([]);
  }

  public putExplorerHistoryItem(item: ExplorerHistoryItem) {
    let his = this.explorerHistorySubject.value.filter((i) => i.id !== item.id);
    his.unshift(item);
    if (his.length > this.MaxExplorerHistoryCount) {
      his.pop();
    }
    localStorage.setItem(this.ExplorerHistoryKey, JSON.stringify(his));
    this.explorerHistorySubject.next(his);
  }

  public navbarVisibilitySubject = new BehaviorSubject<boolean>(true);

  public loginUsersSubject = new BehaviorSubject<LoginUser>(null);

  tryLogin(): Observable<any> {
    if (!this.canLogin) {
      return this.nullUser();
    }
    return this.loginService.on().pipe(
      tap((data) => {
        if (
          !data.result &&
          data.error != Configs.ServiceMessagesEnum.NotLogin.toString()
        ) {
          throw data.error;
        }
        this.updateUserWhenDiff(data.data);
      })
    );
  }

  nullUser(): Observable<any> {
    return timer(0).pipe(
      map(() => {
        this.updateUserWhenDiff(null);
        return null;
      })
    );
  }

  public updateUserWhenDiff(user) {
    user = user || null;
    this.loginUsersSubject.next(user);
  }

  login(name: string, password: string): Observable<ApiResultLoginUser> {
    if (!this.canLogin) {
      return this.nullUser();
    }
    return this.loginService.pwdOn({ name, password }).pipe(
      tap((data) => {
        if (!data.result) {
          throw data.error;
        }
        this.updateUserWhenDiff(data.data);
      })
    );
  }

  logout(): Observable<ApiResult> {
    return this.loginService.off().pipe(
      tap((data) => {
        if (!data.result) {
          throw data.error;
        }
        this.updateUserWhenDiff(null);
        this.clearExplorerHistory();
      })
    );
  }

  public updateTheme() {
    this.currentThemeIdx =
      (this.currentThemeIdx + this.themes.length) % this.themes.length;
    if (this.themes[this.currentThemeIdx]) {
      let theme = this.themes[this.currentThemeIdx];
      document.documentElement.classList.add(theme);
      localStorage.setItem(this.ThemeKey, theme);
    }
  }

  public changeTheme() {
    if (this.themes[this.currentThemeIdx]) {
      let theme = this.themes[this.currentThemeIdx];
      document.documentElement.classList.remove(theme);
    }
    this.currentThemeIdx++;
    this.updateTheme();
  }
}
