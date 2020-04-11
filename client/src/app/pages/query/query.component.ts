import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { MenuConfig } from "src/app/services/app.service";
import { NodesService, NodeItem } from "src/app/apis";
import { NotifyService } from "src/app/services/notify.service";
import { Subscription, throwError } from "rxjs";
import { EditorComponent } from "../editor/editor.component";
import { ConvertToNodeModel, Node } from "src/app/models/node";
import { ConfigsService } from "src/app/services/configs.service";
import { isNullOrSpace } from "src/app/utils/util";
import { switchMap, tap } from "rxjs/operators";
import { ScriptAppService } from "src/app/services/script-app.service";

@Component({
  selector: "app-query",
  templateUrl: "./query.component.html",
  styleUrls: ["./query.component.scss"],
})
export class QueryComponent implements OnInit, OnDestroy {
  public menu: MenuConfig;
  public selectedMenu: MenuConfig;

  public isDir = false;

  public filter: string;

  constructor(
    public nodesApi: NodesService,
    public notifyService: NotifyService,
    public configsService: ConfigsService,
    public route: ActivatedRoute,
    public router: Router,
    public scriptAppService: ScriptAppService
  ) {
    this.menu = this.route.snapshot.data.menu;
    this.isDir = this.menu.children && this.menu.children.length > 0;
  }
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  apps = new Map<string, string>();

  appTag: string = null;

  getNodeApp(node: Node) {
    return this.scriptAppService.getNodeApp(
      this,
      node.tags,
      this.nodesApi,
      this.configsService
    );
  }

  public updateChildRoute() {
    this.showEditor = false;
    this.selectedMenu = null;
    let child = this.route.firstChild;
    if (child) {
      this.selectedMenu = child.snapshot.data.menu;
    }
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else {
        this.showEditor = child.component === EditorComponent;
        break;
      }
    }
  }

  public search = (data: { filter }) => {
    if (isNullOrSpace(data.filter)) return;
    this.router.navigateByUrl(this.getRouteLink(0, data.filter.trim()));
  };

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.updateChildRoute();
      }
    });
    this.updateChildRoute();
    if (!this.isDir) {
      this.route.params.subscribe(async (p) => {
        this.filter = p["filter"].trim();
        if (this.filter == "") {
          this.filter = null;
        }
        let page = p["pageId"] * 1;
        this.currentPage = page;
        this.reloadNodesOnPage();
      });
    }
  }

  public currentPage = 0;
  public pageSize = 10;
  public showEditor = false;
  public totalCount = 0;
  public totalPage = 0;
  public preLink: string;
  public nextLink: string;
  public nodes: Node[];
  public routerSubscription: Subscription;

  public isBlog(node: Node) {
    return node.type == NodeItem.TypeEnum.Blog;
  }

  public getIcon(node: NodeItem) {
    switch (node.type) {
      case NodeItem.TypeEnum.Folder:
        return "folder";
      case NodeItem.TypeEnum.Blog:
        return "description";
      default:
        return "broken_image";
    }
  }

  public getRouteLink(page = null, filter = null) {
    if (page === null) {
      page = this.currentPage;
    }
    if (filter == null) {
      filter = this.filter;
    }
    return this.router
      .createUrlTree([this.menu.name, filter || " ", page], {
        relativeTo: this.route.parent,
      })
      .toString();
  }

  public reloadNodesOnPage() {
    this.nodesApi
      .queryNodes(
        this.menu.query,
        this.filter,
        this.currentPage * this.pageSize,
        this.pageSize
      )
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) {
            this.nodes = [];
            this.totalCount = 0;
            this.totalPage = 0;
            throw apiRes.error;
          }
          this.totalCount = apiRes.data.total;
        }),
        switchMap((apiRes) =>
          ConvertToNodeModel(apiRes.data.data, this.configsService)
        ),
        tap((nodes) => {
          this.nodes = nodes;
          this.totalPage = Math.ceil(this.totalCount / this.pageSize);
          this.preLink = decodeURI(this.getRouteLink(this.currentPage - 1));
          this.nextLink = decodeURI(this.getRouteLink(this.currentPage + 1));
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  }
}
