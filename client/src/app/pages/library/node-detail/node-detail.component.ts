import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  NodeItem,
  NodesService,
  Blog,
  Configs,
  LoginUser,
  TagItem,
} from "src/app/apis";
import { NotifyService } from "src/app/services/notify.service";
import { AppService } from "src/app/services/app.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ConfigsService } from "src/app/services/configs.service";
import { ConvertToNodeModel, Node, UpdateNodeTags } from "src/app/models/node";
import { ArticleEditorModel } from "src/app/shared/app-editors/article-editor/article-editor.component";
import { IframePythonService } from "src/app/shared/python-service/python-service";
import { ScriptAppService } from "src/app/services/script-app.service";
import {
  FileApiService,
  fileApiUrls,
} from "src/app/services/file_api_service/index";
import { PopupComponent } from "src/app/shared/popup/popup.component";
import NodeBase from "../node-base";
import {
  throwError,
  Observable,
  empty,
  forkJoin,
  timer,
  Subscription,
} from "rxjs";
import { tap, map, switchMap } from "rxjs/operators";

@Component({
  selector: "app-node-detail",
  templateUrl: "./node-detail.component.html",
  styleUrls: ["./node-detail.component.scss"],
})
export class NodeDetailComponent implements OnInit, OnDestroy {
  public readonly NodeItem = NodeItem;
  public hasPostPermission = false;
  public parentNode: Node;
  public currentNode: Node;
  public loginUser: LoginUser;
  public nodeId: string;
  public subscriptions: Subscription[] = [];
  public isEditTag: boolean = false;

  public get isOwnNode() {
    return (
      this.loginUser != null &&
      this.currentNode != null &&
      this.currentNode.user != null &&
      this.loginUser.id === this.currentNode.user.id
    );
  }

  public updateShared = (shared: boolean) => {
    this.nodesApi
      .updateNodeShared(this.nodeId, shared)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.currentNode.shared = shared;
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  public addTag({ tag, value }: { tag: TagItem; value: string }) {
    const errorMsg = Configs.ServiceMessagesEnum.InvalidTagValues;
    if (tag.type === TagItem.TypeEnum.Bool) {
      if (value !== null) {
        this.notifyService.toast(errorMsg);
        return;
      }
    } else {
      if (!value || !value.trim()) {
        this.notifyService.toast(errorMsg);
        return;
      }
      value = value.trim();
      if (
        tag.type === TagItem.TypeEnum.Url &&
        !value.match(/[a-zA-Z0-9]*:\/\//)
      ) {
        this.notifyService.toast(errorMsg);
        return;
      }
    }

    this.nodesApi
      .updateTag(this.currentNode.id, tag.id, value)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw errorMsg;
          if (!this.currentNode.tags) this.currentNode.tags = [];
          let nodeTagIdx = this.currentNode.tags.findIndex(
            (t) => t.id === tag.id
          );
          if (nodeTagIdx < 0) {
            this.currentNode.tags.push({
              id: tag.id,
              name: tag.name,
              type: tag.type,
              value,
              values: tag.values,
            });
          } else {
            this.currentNode.tags[nodeTagIdx].value = value;
          }
          this.currentNode.tags = this.currentNode.tags.slice(0);
        }),
        switchMap(() => UpdateNodeTags(this.currentNode, this.configsService))
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  }

  public removeTag(tag) {
    if (!this.currentNode.tags) {
      return;
    }
    let nodeTagIdx = this.currentNode.tags.findIndex((t) => t.id === tag.id);
    if (nodeTagIdx < 0) {
      return;
    }
    this.nodesApi
      .removeTag(this.currentNode.id, tag.id)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result)
            throw Configs.ServiceMessagesEnum.InvalidTagValues;
          this.currentNode.tags.splice(nodeTagIdx, 1);
          this.currentNode.tags = this.currentNode.tags.slice(0);
        }),
        switchMap(() => UpdateNodeTags(this.currentNode, this.configsService))
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.pageDestroy();
    this.subscriptions = [];
  }
  ngOnInit() {
    this.subscriptions.push(
      this.appService.loginUsers.subscribe(async (user) => {
        this.loginUser = user;
        this.hasPostPermission =
          user != null &&
          user.permissions != null &&
          user.permissions[Configs.PermissionDescriptionsEnum.POSTBLOG];
      })
    );
    this.pageInit();
  }

  public maxImageSize: number = 0;
  public pythonService: { value: IframePythonService };
  public blog: Blog;
  public solution: Blog;
  public isEditBlog = false;
  public isEditSolution = false;
  public readonly popupOption = {
    maxWidth: "100vw",
    maxHeight: "100vh",
    height: "100%",
    width: "100%",
    panelClass: "fullscreen-dialog",
  };
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public scriptAppService: ScriptAppService,
    public configsService: ConfigsService,
    public nodesApi: NodesService,
    public notifyService: NotifyService,
    public appService: AppService,
    public fileApiService: FileApiService
  ) {
    this.configsService
      .getConfig(Configs.AppConfigsEnum.MAXFILESIZE.toString())
      .subscribe((s) => (this.maxImageSize = Number.parseInt(s, 10)));
  }

  public toInsertImage = (blob: Blob): Observable<string> => {
    return this.fileApiService
      .fetch(fileApiUrls.Files_UploadFile, { blob })
      .pipe(
        map((apiRes) => {
          if (!apiRes.result) {
            this.notifyService.toast(apiRes.error);
            return "";
          }
          return apiRes.data;
        })
      );
  };
  public loadPaths(id): Observable<any> {
    if (!id) {
      return timer(0).pipe(
        tap(() => {
          this.parentNode = null;
          this.currentNode = null;
          this.pythonService = null;
        })
      );
    }
    return this.nodesApi.pathNodes(id).pipe(
      tap((apiRes) => {
        if (!apiRes.result) {
          this.parentNode = null;
          this.currentNode = null;
          this.pythonService = null;
          throw apiRes.error;
        }
      }),
      switchMap((apiRes) =>
        ConvertToNodeModel(apiRes.data, this.configsService)
      ),
      tap((nodes) => {
        if (nodes && nodes.length > 0) {
          this.currentNode = nodes.pop();
          this.pythonService =
            this.currentNode.solutionType === "python"
              ? { value: new IframePythonService() }
              : null;
          this.parentNode = nodes[nodes.length - 1];
        }
      })
    );
  }

  public apps = new Map<string, string>();

  public appTag: string = null;

  getNodeApp(node: Node) {
    return this.scriptAppService.getNodeApp(
      { apps: this.apps, appTag: this.appTag },
      node.tags,
      this.nodesApi,
      this.configsService
    );
  }

  public loadContent(): Observable<any> {
    if (this.currentNode == null) {
      return empty();
    }
    var type = this.currentNode.reference
      ? this.currentNode.reference.type
      : this.currentNode.type;

    if (type != NodeItem.TypeEnum.Blog) {
      return empty();
    }
    var contentId = this.currentNode.reference
      ? this.currentNode.reference.id
      : this.nodeId;
    return forkJoin(
      this.nodesApi.getBlog(contentId),
      this.nodesApi.getBlogCustomSolution(contentId)
    ).pipe(
      tap(([blogRes, solutionRes]) => {
        !blogRes.result && this.notifyService.toast(blogRes.error);
        !solutionRes.result && this.notifyService.toast(solutionRes.error);
        this.blog = blogRes.data || "";
        this.solution = solutionRes.data || "";
      })
    );
  }

  public updateBlogContent = (content: string) => {
    if (this.blog == null) {
      return;
    }
    this.nodesApi
      .updateBlogContent(
        this.blog.id,
        JSON.stringify(content),
        this.parseFilesFromContent(content)
      )
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) {
            this.notifyService.toast(apiRes.error);
          }
          this.hasSaved = true;
          this.blog.content = content;
        })
      )
      .subscribe();
  };

  private parseFilesFromContent(content: string) {
    if (!content) {
      return [];
    }
    var exp = /\/files\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.[0-9a-zA-Z]*/g;
    return content.match(exp) || [];
  }

  public updateBlogSolution = (content: string) => {
    if (this.blog == null || this.solution == null) {
      return;
    }
    this.nodesApi
      .updateBlogSolution(
        this.blog.id,
        this.solution.name,
        JSON.stringify(content),
        this.parseFilesFromContent(content)
      )
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) {
            this.notifyService.toast(apiRes.error);
          }
          this.hasSaved = true;
          this.solution.content = content;
          this.solution.id = apiRes.data;
        })
      )
      .subscribe();
  };
  private hasSaved = false;
  public editMode: ArticleEditorModel | {} = {};
  public startEditSolution(popupRef: PopupComponent) {
    this.hasSaved = false;
    if (this.solution == null) {
      this.configsService
        .getConfig(Configs.UiLangsEnum.SolutionTo.toString())
        .subscribe((namePrefix) => {
          this.solution = { name: namePrefix + this.currentNode.name };
        });
    }
    var _this = this;
    this.editMode = {
      maxImageSize: this.maxImageSize,
      content: (this.solution && this.solution.content) || "",
      id: this.solution && this.solution.id,
      solutionToContent: this.blog.content || "",
      type: this.currentNode.solutionType,
      solutionToType: this.currentNode.docType,
      imageInserted: this.toInsertImage,
      errored: this.onError,
      saved: this.updateBlogSolution,
      closed: () => {
        if (_this.hasSaved) {
          _this.nodesApi
            .deleteTempBlogFiles(_this.solution.id)
            .subscribe({ error: (er) => this.notifyService.toast(er) });
        }
        popupRef.close();
      },
    };
    popupRef.show();
  }

  public startEditContent = (popupRef: PopupComponent) => {
    this.hasSaved = false;
    var _this = this;
    this.editMode = {
      maxImageSize: this.maxImageSize,
      content: this.blog.content || "",
      id: this.blog.id,
      type: this.currentNode.docType,
      imageInserted: this.toInsertImage,
      errored: this.onError,
      saved: this.updateBlogContent,
      closed: () => {
        if (_this.hasSaved) {
          _this.nodesApi
            .deleteTempBlogFiles(_this.blog.id)
            .subscribe({ error: (er) => this.notifyService.toast(er) });
        }
        popupRef.close();
      },
    };
    popupRef.show();
  };
  public onError(str) {
    this.notifyService.toast(str);
  }
  pageInit() {
    this.subscriptions.push(
      this.route.params.subscribe(async (p: Params) => {
        const nodeId = p["nodeId"];
        this.nodeId = nodeId == "0" || nodeId === "" ? null : nodeId;

        this.loadPaths(this.nodeId)
          .pipe(switchMap(() => this.loadContent()))
          .subscribe({ error: (er) => this.notifyService.toast(er) });
      })
    );
  }
  pageDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
