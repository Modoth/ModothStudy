import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NodesService, LoginUser, NodeItem, Configs } from 'src/app/apis';
import { NotifyService } from 'src/app/services/notify.service';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfigsService } from 'src/app/services/configs.service';
import { Subscription, throwError, Observable, of, from, forkJoin } from 'rxjs';
import { ConvertToNodeModel, Node } from 'src/app/models/node';
import { ArticleEditorModel } from 'src/app/shared/app-editors/article-editor/article-editor.component';
import { IframePythonService } from 'src/app/shared/python-service/python-service';
import { DomSanitizer } from '@angular/platform-browser';
import { ScriptAppService } from 'src/app/services/script-app.service';
import { FileApiService, fileApiUrls } from 'src/app/services/file_api_service/index'
import { PopupComponent } from 'src/app/shared/popup/popup.component'
import { switchMap, tap, distinctUntilChanged, map, toArray, withLatestFrom } from 'rxjs/operators';


class NodeViewItem {
  constructor(node: Node) {
    this.node = node;
    this.pathLevel = node.path.split("/").length;
    this.isFolder = node.type == NodeItem.TypeEnum.Folder;
    this.isBlog = node.type == NodeItem.TypeEnum.Blog;
    this.hasSolution = node.hasSolution;
  }
  node: Node;
  solution: string;
  pathLevel: number;
  isFolder = false;
  isBlog = true;
  hasSolution = false;
  ownNode = false;
  mySolution: string = null;
  myTmpSolution = '';
  pythonService: { value: IframePythonService };
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']

})

export class EditorComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.additionalStyle) {
      this.additionalStyle.remove();
    }
    this.blobUrls.forEach(b => window.URL.revokeObjectURL(b));
    this.appService.changeNavbarVisibility(true);
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  public nodes: NodeViewItem[]
  public commentingItem: Node = null;
  public parentNode: NodeItem;
  public hasMoreNode = false;
  public showSolution = false;
  public showEditor = false;
  public hasOtherNode = false;
  public additionalStyle: HTMLElement;
  public hasAnySolution = false;
  public loginUser: LoginUser;
  public nodeId: string;
  public MAX_COUNT = 100;
  public subscriptions: Subscription[] = [];
  public blobUrls = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public location: Location,
    public nodesApi: NodesService,
    public notifyService: NotifyService,
    public appService: AppService,
    public sanitizer: DomSanitizer,
    public scriptAppService: ScriptAppService,
    public configsService: ConfigsService,
    public fileApiService: FileApiService) {
    this.appService.changeNavbarVisibility(false);
    this.subscriptions.push(this.configsService.getConfig(Configs.AppConfigsEnum.MAXFILESIZE.toString())
      .subscribe(s => this.maxImageSize = Number.parseInt(s, 10)));
  }

  ngOnInit() {
    const mySub = this.appService.loginUsers.pipe(
      distinctUntilChanged(),
      tap(user => {
        this.loginUser = user;
        this.hasReplySolutionPersission = this.loginUser != null && this.loginUser.permissions != null &&
          this.loginUser.permissions[Configs.PermissionDescriptionsEnum.REPLYSOLUTION];
      }),
      switchMap(() => this.route.paramMap),
      tap((p: ParamMap) => {
        const nodeId = p.get('nodeId');
        if (nodeId == null) {
          this.location.go("/");
        }
        this.nodeId = nodeId;
        this.update()
      })
    ).subscribe()
    this.subscriptions.push(mySub)
  }

  public print = () => {
    if (window.print) {
      window.print();
    }
  }

  public close = () => {
    this.appService.navagateBackOrHome();
  }

  public openLocation = () => {
    if (this.parentNode) {
      var node = this.parentNode;
      var path = `/library/list/${node.type == NodeItem.TypeEnum.Folder ? node.id : node.id}/ /0`;
      this.router.navigateByUrl(path);
    }
  }

  public switchSolutions = () => {
    this.showSolution = !this.showSolution;
  }

  public toggleEditor() {
    this.showEditor = !this.showEditor;
  }

  public updateMySolution(solution: string, item: NodeViewItem) {
    if (!this.hasReplySolutionPersission || item == null || !item.hasSolution) {
      return;
    }
    this.subscriptions.push(this.configsService.getConfig(Configs.UiLangsEnum.SolutionTo.toString()).pipe(
      switchMap(solutionPrefix => this.nodesApi.updateBlogSolution(item.node.id, solutionPrefix + item.node.name, JSON.stringify(solution || ''))),
      tap(apiRes => {
        item.mySolution = solution
        if (!apiRes.result) throw apiRes.error;
      })
    ).subscribe({ error: er => this.notifyService.toast(er) }))
  }

  public maxImageSize = 0;

  public onError(str) {
    this.notifyService.toast(str);
  }

  public toInsertImage = (blob: Blob): Observable<string> => {
    return this.fileApiService.fetch(fileApiUrls.Files_UploadFile, { blob }).pipe(
      map(apiRes => {
        if (!apiRes.result) {
          this.notifyService.toast(apiRes.error)
          return ''
        }
        return apiRes.data
      })
    )
  }

  public getMySolution(item: NodeViewItem): Observable<NodeViewItem> {
    return this.nodesApi.getBlogCustomSolution(item.node.id).pipe(
      map(apiRes => {
        if (!apiRes.result) {
          this.notifyService.toast(apiRes.error)
          item.mySolution = ""
          return item
        }
        if (apiRes.data == null || apiRes.data.content == null || apiRes.data.content == '') {
          item.mySolution = "";
          return item
        }
        item.mySolution = apiRes.data.content;
        return item
      })
    );
  }

  public loadMySolution(item: NodeViewItem, popupRef: PopupComponent) {
    if (!this.hasReplySolutionPersission || !item.hasSolution) {
      return;
    }
    if (item.mySolution == null) {
      this.getMySolution(item).subscribe(node => {
        this.editMySolution(node, popupRef)
      })
      return
    }
    this.editMySolution(item, popupRef);
  }

  editMySolution(item: NodeViewItem, popupRef: PopupComponent) {
    this.editMode = {
      maxImageSize: this.maxImageSize,
      content: item.mySolution,
      solutionToContent: item.node.content,
      solutionToType: item.node.docType,
      type: item.node.solutionType,
      imageInserted: this.toInsertImage,
      errored: this.onError,
      saved: content => this.updateMySolution(content, item),
      closed: () => popupRef.close()
    };
    popupRef.show()
  }

  public createTempFileUrl = (blob: Blob): Observable<any> => {
    const url = window.URL.createObjectURL(blob);
    this.blobUrls.push(url);
    return of(this.sanitizer.bypassSecurityTrustUrl(url));

  }
  public readonly popupOption = {
    maxWidth: '100vw',
    maxHeight: '100vh',
    height: '100%',
    width: '100%',
    panelClass: 'fullscreen-dialog'
  }

  public editMode: ArticleEditorModel | any = {}
  editTmpSolution(item: NodeViewItem, popupRef: PopupComponent) {
    this.editMode = {
      maxImageSize: this.maxImageSize,
      content: item.myTmpSolution,
      solutionToContent: item.node.content,
      solutionToType: item.node.docType,
      type: item.node.solutionType,
      imageInserted: this.createTempFileUrl,
      errored: this.onError,
      saved: content => {
        item.myTmpSolution = content;
        this.notifyService.toast(Configs.UiLangsEnum.TmpFileWillNotSave);
      },
      closed: () => popupRef.close()
    };
    popupRef.show()
  }

  getEditMySolution(item: NodeViewItem, popupRef: PopupComponent) {
    return () => this.editMySolution(item, popupRef)
  }

  getEditTmpSolution(item: NodeViewItem, popupRef: PopupComponent) {
    return () => this.editTmpSolution(item, popupRef);
  }

  public loadSolution = (item: NodeViewItem) => {
    if (!item.hasSolution || item.solution != null) {
      return;
    }
    this.nodesApi.getBlogDefaultSolution(item.node.id).pipe(
      switchMap(apiRes => {
        if (!apiRes.result) {
          this.notifyService.toast(apiRes.error);
          return this.configsService.getConfig("NoSolution")
        }
        if (apiRes.data == null || apiRes.data.content == null || apiRes.data.content == '') {
          return this.configsService.getConfig("NoSolution")
        }
        return of(apiRes.data.content);
      }),
      tap(solution => item.solution = solution)
    ).subscribe()
  }

  public hasReplySolutionPersission = false;

  public update() {
    this.nodesApi.allLevelNodes(this.nodeId, 0, this.MAX_COUNT).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
        this.nodes = [];
        this.commentingItem = null;
        this.hasMoreNode = false;
        this.hasMoreNode = this.MAX_COUNT < apiRes.data.total
      }),
      switchMap(apiRes => ConvertToNodeModel(apiRes.data.data, this.configsService)),
      switchMap(nodes => from(nodes || []).pipe(withLatestFrom(of(new NodeViewItem(nodes[0]))))),
      map(([node, rootNode]) => {
        const rootLevel = rootNode.pathLevel;
        const n = new NodeViewItem(node)
        n.pathLevel = n.pathLevel - rootLevel;
        n.ownNode = this.loginUser != null && n.node.user.id == this.loginUser.id;
        n.pythonService = n.node.solutionType === 'python' ? { value: new IframePythonService() } : null;
        this.hasAnySolution = this.hasAnySolution || n.hasSolution;
        this.hasOtherNode = this.hasOtherNode || !n.ownNode;
        return n
      }),
      toArray(),
      tap(nodes => {
        nodes.length > 0 && this.appService.putExplorerHistoryItem({ title: nodes[0].node.name, id: nodes[0].node.id, date: new Date() })
        this.nodes = nodes;
        this.applyStyles();
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
    this.nodesApi.pathNodes(this.nodeId).pipe(
      tap(apiRes => {
        if (!apiRes.result) {
          this.parentNode = null;
          throw apiRes.error;
        }
        this.parentNode = apiRes.data[apiRes.data.length - 2] || apiRes.data[apiRes.data.length - 1];
      })).subscribe({ error: er => this.notifyService.toast(er) });
  }

  apps = new Map<string, string>()

  appTag: string = null;

  getNodeApp(node: NodeViewItem) {
    return this.scriptAppService.getNodeApp(this, node.node.tags, this.nodesApi, this.configsService);
  }

  public applyStyles() {
    if (this.additionalStyle) {
      this.additionalStyle.remove();
    }
    this.getStyle().pipe(
      tap(([type, style]) => {
        if (style) {
          style = style.replace('\n', '');
          style = style.replace(/([^}]+)\s*(?=[{])/gm, ss => ss.split(',').map(s => '.papper ' + s).join(', '))
          let sty: any = document.createElement('style');
          sty.innerText = style;
          window.document.head.appendChild(sty);
          this.additionalStyle = sty;
        }
      })
    ).subscribe()
  }

  public getStyle(): Observable<string[]> {
    return forkJoin(
      this.configsService.getConfig(Configs.AppConfigsEnum.EDITORSTYLETAG.toString()),
      this.configsService.getConfig(Configs.AppConfigsEnum.EDITORSTYLES.toString())
    ).pipe(
      map(([deaultType, styles]) => {
        const node = this.nodes[0]
        let type = deaultType
        if (node && node.node.tags && node.node.tags.length) {
          const tags = node.node.tags
          const tag = tags.find(t => t.name === deaultType)
          if (tag) {
            type = tag.value
          }
        }
        let result = [type]
        if (styles) {
          try {
            let jsonStyles = JSON.parse(styles);
            result.push(jsonStyles[type])
          } catch { }
        }
        return result
      })
    )
  }
}
