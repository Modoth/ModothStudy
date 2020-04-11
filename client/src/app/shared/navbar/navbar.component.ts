import { Component, OnInit } from "@angular/core";
import { AppService, MenuConfig } from "src/app/services/app.service";
import { LoginUser, Configs, Query, Condition } from "src/app/apis";
import { Router, NavigationError } from "@angular/router";
import { Subscription, BehaviorSubject } from "rxjs";
import { QueryComponent } from "src/app/pages/query/query.component";
import { EditorComponent } from "src/app/pages/editor/editor.component";
import { ErrorHandler } from "@angular/router/src/router";
import { ConfigsService } from "src/app/services/configs.service";
import { NotifyService } from "src/app/services/notify.service";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  constructor(
    public appService: AppService,
    public notifyService: NotifyService,
    public configsService: ConfigsService,
    public router: Router,
    public matIconRegistry: MatIconRegistry,
    public domSanitizer: DomSanitizer
  ) {
    this.appService.loginUsers.subscribe((u) => (this.loginUser = u));
    this.configsService
      .configs(Configs.AppConfigsEnum.MENUS.toString())
      .subscribe((menus) => this.updateMenus(menus));
    this.errorUrlSubscribe = this.router.events.subscribe((e) => {
      if (!(e instanceof NavigationError)) {
        return;
      }
      const error: NavigationError = e;
      this.routerErrorHandler = this.router.errorHandler;
      this.router.errorHandler = () => {
        return true;
      };
      this.errorUrl = error.url;
    });
  }

  public loginUser: LoginUser;

  public errorUrl: string;

  public logoIcon = new BehaviorSubject<string>(null);

  public logoUrl: string;

  public errorUrlSubscribe: Subscription;

  public routerErrorHandler: ErrorHandler;

  public initRouteConfig: any[];

  public menus: MenuConfig[];
  get showManageTab() {
    return (
      this.loginUser &&
      this.loginUser.permissions &&
      this.loginUser.permissions[Configs.PermissionDescriptionsEnum.MANAGE]
    );
  }

  updateMenus(menusStr: string) {
    let menus: MenuConfig[];
    let rootQuery: Query;
    if (menusStr == null || menusStr === "") {
      if (!this.initRouteConfig) {
        return;
      }
      menus = [];
    } else {
      try {
        const menusConfig = JSON.parse(menusStr);
        menus = menusConfig.menus || [];
        if (menusConfig.rootQuery) {
          rootQuery = menusConfig.rootQuery;
        }
      } catch (e) {
        console.log(e);
        this.notifyService.toast(Configs.ServiceMessagesEnum.SiteConfigError);
        menus = [];
      }
    }

    if (!this.initRouteConfig) {
      this.initRouteConfig = this.router.config;
    }
    this.menus = menus;
    const newRouteConfigs = menus.map((m) => this.getRoute(m, rootQuery));
    this.router.resetConfig(this.initRouteConfig.concat(newRouteConfigs));
    if (this.errorUrl) {
      this.router.navigateByUrl(this.errorUrl);
      this.errorUrlSubscribe.unsubscribe();
      this.errorUrl = null;
      this.router.errorHandler = this.routerErrorHandler;
    }
  }

  mergeQuery(parentQuery: Query, childQuery: Query) {
    if (!parentQuery) {
      return childQuery;
    }
    childQuery.parent = childQuery.parent || parentQuery.parent;
    if (!childQuery.orderBy) {
      childQuery.orderBy = parentQuery.orderBy;
      childQuery.orderByDesc =
        childQuery.orderByDesc || parentQuery.orderByDesc;
    }
    const mergedConditions: Condition = {
      type: Condition.TypeEnum.And,
      children: [],
    };
    if (parentQuery.where) {
      if (parentQuery.where.type === Condition.TypeEnum.And) {
        mergedConditions.children.push(...parentQuery.where.children);
      } else {
        mergedConditions.children.push(parentQuery.where);
      }
    }
    if (childQuery.where) {
      if (childQuery.where.type === Condition.TypeEnum.And) {
        mergedConditions.children.push(...childQuery.where.children);
      } else {
        mergedConditions.children.push(childQuery.where);
      }
    }
    childQuery.where = mergedConditions;
    return childQuery;
  }

  getRoute(menu: MenuConfig, rootQuery: Query) {
    const hasChildren = menu.children && menu.children.length > 0;
    const urlName = menu.name;
    const menuLink = hasChildren ? urlName : `${urlName}/:filter/:pageId`;
    menu.defaultLink = hasChildren ? urlName : `${urlName}/ /0`;
    let childrenRootQuery = rootQuery;
    if (menu.query) {
      menu.query = this.mergeQuery(rootQuery, menu.query);
      childrenRootQuery = menu.query;
    }
    if (menu.query) {
    }
    if (!hasChildren) {
      return {
        path: menuLink,
        pathMatch: "prefix",
        component: QueryComponent,
        data: { menu },
        children: [
          {
            path: "editor/:nodeId",
            pathMatch: "full",
            component: EditorComponent,
            data: {},
          },
        ],
      };
    }
    return {
      path: menuLink,
      pathMatch: "prefix",
      component: QueryComponent,
      data: { menu },
      children: menu.children.map((c) => this.getRoute(c, childrenRootQuery)),
    };
  }

  public logoIcons = new Set<string>();

  ngOnInit() {
    this.configsService
      .configs(Configs.AppConfigsEnum.TITLE.toString())
      .subscribe((t) => {
        document.title = t || "";
      });
    this.configsService
      .configs(Configs.AppConfigsEnum.LOGO.toString())
      .subscribe((logoUrl) => {
        if (logoUrl && logoUrl.endsWith("svg")) {
          if (!this.logoIcons.has(logoUrl)) {
            this.matIconRegistry.addSvgIcon(
              logoUrl,
              this.domSanitizer.bypassSecurityTrustResourceUrl(logoUrl)
            );
          }
          this.logoUrl = null;
          this.logoIcon.next(logoUrl);
        } else {
          this.logoUrl = logoUrl;
        }
      });
  }
}
