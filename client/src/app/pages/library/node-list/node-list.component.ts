import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  NodeItem,
  NodesService,
  Configs,
  TagItem,
  LoginUser,
} from "src/app/apis";
import { NotifyService } from "src/app/services/notify.service";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { ConfigsService } from "src/app/services/configs.service";
import { ConvertToNodeModel, Node, UpdateNodeTags } from "src/app/models/node";
import { isNullOrSpace } from "src/app/utils/util";
import NodeBase from "../node-base";
import { throwError, timer, Observable, Subscription } from "rxjs";
import { tap, switchMap } from "rxjs/operators";
import { PopupComponent } from "src/app/shared/popup/popup.component";

@Component({
  selector: "app-node-list",
  templateUrl: "./node-list.component.html",
  styleUrls: ["./node-list.component.scss"],
})
export class NodeListComponent implements OnInit, OnDestroy {
  public readonly NodeItem = NodeItem;
  public hasPostPermission = false;
  public parentNode: Node;
  public currentNode: Node;
  public loginUser: LoginUser;
  public nodeId: string;
  public subscriptions: Subscription[] = [];
  public isEditTag: boolean = false;
  public wxEnabled = false;

  public get canShareWx() {
    return (
      this.wxEnabled &&
      this.loginUser &&
      this.loginUser.permissions &&
      this.loginUser.permissions[Configs.PermissionDescriptionsEnum.THIRDSHARE]
    );
  }

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
          this.subNodes && this.subNodes.forEach((n) => (n.shared = shared));
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  public updateWxShared = (shared: boolean) => {
    this.nodesApi
      .updateWxShare(this.nodeId, shared)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          let tag = apiRes.data;
          let nodeTagIdx = this.currentNode.tags.findIndex(
            (t) => t.id === tag.id
          );
          this.currentNode.wxShared = shared;
          if (shared) {
            if (nodeTagIdx < 0) {
              this.currentNode.tags.push(tag);
            } else {
              this.currentNode.tags[nodeTagIdx] = tag;
            }
          } else {
            if (nodeTagIdx >= 0) {
              this.currentNode.tags.splice(nodeTagIdx, 1);
            }
          }
          this.currentNode.tags = this.currentNode.tags.slice(0);
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
      }),
      this.configsService
        .getConfig(Configs.AppConfigsEnum.WXENABLED.toString())
        .subscribe((enabled) => {
          this.wxEnabled = !!enabled;
        })
    );
  }

  public readonly nodeTypes = [
    NodeItem.TypeEnum.Blog,
    NodeItem.TypeEnum.Reference,
    NodeItem.TypeEnum.Folder,
  ];
  public readonly deleteStr = Configs.UiLangsEnum.Delete;
  public readonly title = Configs.UiLangsEnum.ConfirmNameToDelete;

  public deleteData: Node;
  public totalCount = 0;
  public filter: string;
  public subNodes: Node[];
  public canAddRef = false;
  public selectedRef: NodeItem;
  public newRefName: string;
  @ViewChild("selectRefPopup") selectRefPopup: PopupComponent;

  constructor(
    public router: Router,
    public appService: AppService,
    public nodesApi: NodesService,
    public configsService: ConfigsService,
    public notifyService: NotifyService
  ) {}

  public search = (data: { filter: string }) => {
    if (isNullOrSpace(data.filter) && isNullOrSpace(this.filter)) return;
    this.router.navigateByUrl(
      `/library/list/${this.nodeId || "0"}/${encodeURI(data.filter.trim())}/0`
    );
  };

  public selectRefFilter = (node: NodeItem) => {
    return true;
  };

  public selectedRefChanged = (node: NodeItem) => {
    this.selectedRef = node;
    this.canAddRef = true;
  };

  public addRef = () => {
    if (!this.canAddRef) {
      return false;
    }
    this.nodesApi
      .createRefNode(this.newRefName, this.currentNode.id, this.selectedRef.id)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.selectedNode(apiRes.data);
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  public create = (type: NodeItem, data: { newNodeName }) => {
    const newNodeName = data.newNodeName.trim();
    switch (type) {
      case NodeItem.TypeEnum.Folder:
      case NodeItem.TypeEnum.Blog:
        if (newNodeName == "") {
          this.notifyService.toast(Configs.ServiceMessagesEnum.InvalidNodeName);
          return;
        }
        this.createNode(newNodeName, type);
        break;
      case NodeItem.TypeEnum.Reference:
        this.newRefName = newNodeName;
        this.selectRefPopup.show();
        break;
    }
    data.newNodeName = "";
  };

  delete(data: { name }) {
    let idx = this.subNodes.indexOf(this.deleteData);
    if (idx < 0) return;
    if (isNullOrSpace(data.name)) return;
    let name = data.name.trim();
    if (name == this.deleteData.name) {
      this.nodesApi
        .removeNode(this.deleteData.id)
        .pipe(
          tap((apiRes) => {
            if (!apiRes.result) throw apiRes.error;
            this.subNodes.splice(idx, 1);
            this.subNodes = this.subNodes.slice(0);
          })
        )
        .subscribe({ error: (er) => this.notifyService.toast(er) });
    }
    data.name = "";
  }

  public createNode(name: string, type) {
    this.nodesApi
      .createNode(name, type, this.nodeId)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) {
            throw apiRes.error;
          }
          this.selectedNode(apiRes.data);
        })
      )
      .subscribe({
        error: (er) => this.notifyService.toast(er),
      });
  }

  public reloadSubNodesOnPage({ filter, pageId, nodeId, pageSize }) {
    nodeId = nodeId == "0" || nodeId === "" ? null : nodeId;
    if (filter != null) {
      filter = decodeURI(filter).trim();
    }
    if (filter === "") {
      filter = null;
    }
    if (nodeId !== this.nodeId) {
      this.getPathNode(nodeId)
        .pipe(
          tap(() => {
            this.getSubNodes(filter, pageId, pageSize);
          })
        )
        .subscribe({ error: (er) => this.notifyService.toast(er) });
    } else {
      this.getSubNodes(filter, pageId, pageSize);
    }
  }

  public getSubNodes(filter, pageId, pageSize) {
    var nodeId =
      this.currentNode && this.currentNode.reference
        ? this.currentNode.reference.id
        : this.currentNode && this.currentNode.id;
    this.nodesApi
      .subNodesOrFilterAllSubNodes(nodeId, filter, +pageId * pageSize, pageSize)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) {
            this.subNodes = [];
            this.totalCount = 0;
            throw apiRes.error;
          }
          this.totalCount = apiRes.data.total;
          this.filter = filter;
        }),
        switchMap((apiRes) =>
          ConvertToNodeModel(apiRes.data.data, this.configsService)
        ),
        tap((nodes) => {
          this.subNodes = nodes;
          if (!filter && this.loginUser && this.subNodes.length > 0) {
            let myRootNode = null;
            if (!nodeId) {
              let myRootIdx = this.subNodes.findIndex(
                (n) => n.user && n.user.id === this.loginUser.id
              );
              if (myRootIdx >= 0) {
                myRootNode = this.subNodes.splice(myRootIdx, 1)[0];
                this.subNodes.unshift(myRootNode);
              }
            } else {
              let mySolutionsIdx = this.subNodes.findIndex(
                (n) => n.path == "/!solutions"
              );
              if (mySolutionsIdx >= 0) {
                myRootNode = this.subNodes.splice(mySolutionsIdx, 1)[0];
                this.subNodes.unshift(myRootNode);
              }
            }
          }
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  }

  public getPathNode(id): Observable<any> {
    if (!id) {
      return timer(0).pipe(
        tap(() => {
          this.parentNode = null;
          this.currentNode = null;
          this.nodeId = id;
        })
      );
    }
    return this.nodesApi.pathNodes(id).pipe(
      tap((apiRes) => {
        if (!apiRes.result) {
          this.parentNode = null;
          this.currentNode = null;
          this.nodeId = id;
          throw apiRes.error;
        }
      }),
      switchMap((apiRes) =>
        ConvertToNodeModel(apiRes.data, this.configsService)
      ),
      tap((nodes) => {
        if (nodes && nodes.length > 0) {
          this.currentNode = nodes.pop();
          this.nodeId = this.currentNode && this.currentNode.id;
          this.parentNode = nodes[nodes.length - 1];
        }
      })
    );
  }

  public selectedNode = (node: NodeItem) => {
    this.router.navigateByUrl(this.getPath(node));
  };

  private getPath = (node: NodeItem) => {
    let type = node.reference ? node.reference.type : node.type;
    const isBlog = type == NodeItem.TypeEnum.Blog;
    // TODO:
    return isBlog
      ? this.isOwnNode
        ? `/library/detail/${node.id || "0"}`
        : `/library/view/${node.id || "0"}`
      : `/library/list/${node.id || "0"}/ /0`;
  };
}
