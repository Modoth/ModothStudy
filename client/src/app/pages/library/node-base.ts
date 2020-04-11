import { OnInit, OnDestroy } from "@angular/core";
import {
  NodeItem,
  NodesService,
  LoginUser,
  TagItem,
  Configs,
} from "src/app/apis";
import { Node, UpdateNodeTags } from "src/app/models/node";
import { Subscription, throwError } from "rxjs";
import { tap, switchMap } from "rxjs/operators";
import { AppService } from "src/app/services/app.service";
import { NotifyService } from "src/app/services/notify.service";
import { ConfigsService } from "src/app/services/configs.service";

export default class NodeBase implements OnDestroy, OnInit {
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
  constructor(
    public _appService: AppService,
    public _notifyService: NotifyService,
    public _nodesApi: NodesService,
    public _configsService: ConfigsService
  ) {}

  public updateShared = (shared: boolean) => {
    this._nodesApi
      .updateNodeShared(this.nodeId, shared)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.currentNode.shared = shared;
        })
      )
      .subscribe({ error: (er) => this._notifyService.toast(er) });
  };

  public addTag({ tag, value }: { tag: TagItem; value: string }) {
    const errorMsg = Configs.ServiceMessagesEnum.InvalidTagValues;
    if (tag.type === TagItem.TypeEnum.Bool) {
      if (value !== null) {
        this._notifyService.toast(errorMsg);
        return;
      }
    } else {
      if (!value || !value.trim()) {
        this._notifyService.toast(errorMsg);
        return;
      }
      value = value.trim();
    }

    this._nodesApi
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
        switchMap(() => UpdateNodeTags(this.currentNode, this._configsService))
      )
      .subscribe({ error: (er) => this._notifyService.toast(er) });
  }

  public removeTag(tag) {
    if (!this.currentNode.tags) {
      return;
    }
    let nodeTagIdx = this.currentNode.tags.findIndex((t) => t.id === tag.id);
    if (nodeTagIdx < 0) {
      return;
    }
    this._nodesApi
      .removeTag(this.currentNode.id, tag.id)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result)
            throw Configs.ServiceMessagesEnum.InvalidTagValues;
          this.currentNode.tags.splice(nodeTagIdx, 1);
          this.currentNode.tags = this.currentNode.tags.slice(0);
        }),
        switchMap(() => UpdateNodeTags(this.currentNode, this._configsService))
      )
      .subscribe({ error: (er) => this._notifyService.toast(er) });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.pageDestroy();
    this.subscriptions = [];
  }
  ngOnInit() {
    this.subscriptions.push(
      this._appService.loginUsers.subscribe(async (user) => {
        this.loginUser = user;
        this.hasPostPermission =
          user != null &&
          user.permissions != null &&
          user.permissions[Configs.PermissionDescriptionsEnum.POSTBLOG];
      })
    );
    this.pageInit();
  }
  pageInit() {}
  pageDestroy() {}
}
