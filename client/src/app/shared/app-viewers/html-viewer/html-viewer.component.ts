import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import {
  IPythonService,
  IframePythonService,
} from "../../python-service/python-service";
import { Observable, Subscription } from "rxjs";
import { PopupComponent } from "../../popup/popup.component";
import { read } from "fs";
import { HtmlAppService } from "src/app/services/html-app.service";

@Component({
  selector: "app-html-viewer",
  templateUrl: "./html-viewer.component.html",
  styleUrls: ["./html-viewer.component.scss"],
})
export class HtmlViewerComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() content: string;

  @Input() id: string;

  @Input() options: any;

  @ViewChild("iframeRef") iframeRef: ElementRef<HTMLIFrameElement>;

  _play = false;

  get play() {
    return this._play;
  }

  set play(value) {
    this._play = value;
    if (value) {
      this.startWatch();
    } else {
      this.stopWatch();
    }
  }

  _pause = false;

  get pause() {
    return this._pause;
  }

  set pause(value) {
    this._pause = value;
    if (!value) {
      this.setCurrent();
    }
  }

  showMenus = false;

  showBorder = true;

  allowWatch = false;

  sandBox = false;

  contentUrl: any;

  @Input() fullscreen = false;

  nonScriptContentUrl: any;

  popContentUrl: string = null;

  @Output() popContentUrlChange = new EventEmitter<string>();

  mdSource: string = null;

  showSource = false;

  showTerminal = false;

  public window: any;

  public canPlay = true;

  public resolveWhenIframeLoaded;

  public pythonService: IframePythonService;

  getApp: () => Observable<string>;

  private htmlAppServiceSubScription: Subscription;

  private appId: string;

  setCurrent() {
    this.htmlAppService.setCurrentApp(this.appId);
  }

  constructor(
    public sanitizer: DomSanitizer,
    private htmlAppService: HtmlAppService
  ) {
    this.window = window;
    this.appId = Math.random().toString().slice(2, 32);
    this.htmlAppServiceSubScription = htmlAppService.currentApp$.subscribe(
      (currentAppId) => {
        if (currentAppId !== this.appId && this.play) {
          this.pause = true;
        }
      }
    );
  }
  ngOnDestroy(): void {
    if (this.htmlAppServiceSubScription) {
      this.htmlAppServiceSubScription.unsubscribe();
    }
    if (this.mCurrentIframeMessageListener) {
      window.removeEventListener("message", this.mCurrentIframeMessageListener);
      this.mCurrentIframeMessageListener = null;
    }
    if (this.mWatchDog) {
      window.clearInterval(this.mWatchDog);
      this.mWatchDog = null;
    }
  }

  private mWatchScript: string;

  ngOnInit() {}

  onPlayClick($event) {
    if (this.sandBox) {
      this.openContentUrl();
      return;
    }
    this.play = true;
    this.pause = false;
    $event.stopPropagation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("options" in changes && this.options) {
      if (!changes["options"].firstChange) {
        return;
      }
      if (this.options.play) {
        this.play = this.options.play.value;
      }
      if (this.options.pause) {
        this.pause = this.options.pause.value;
      }
      if (this.options.sandBox) {
        this.sandBox = this.options.sandBox.value;
      }
      if (this.options.showMenus) {
        this.showMenus = this.options.showMenus.value;
      }
      if (this.options.showBorder) {
        this.showBorder = this.options.showBorder.value;
      }
      if (this.options.pythonService) {
        this.pythonService = this.options.pythonService.value;
      }
      if (this.options.getApp) {
        this.getApp = this.options.getApp.value;
      }
    }
    if ("content" in changes) {
      if (this.getApp && !this.content) {
        this.getApp().subscribe((content) => {
          if (!content) {
            return;
          }
          this.content = content;
          this.parseContent();
        });
      }
      this.parseContent();
    }
  }

  public isBlock = false;

  private mCurrentIframeMessageListener: any;

  private mMaxBitStopTime = 3000;

  private mBitTime = 500;

  private mWatchDog: any;

  openContentUrl() {
    window.open(this.popContentUrl, "_blank");
  }

  stopWatch() {
    if (this.mWatchDog) {
      window.clearInterval(this.mWatchDog);
      this.mWatchDog = null;
    }
    if (this.mCurrentIframeMessageListener) {
      window.removeEventListener("message", this.mCurrentIframeMessageListener);
      this.mCurrentIframeMessageListener = null;
    }
  }

  startWatch() {
    this.stopWatch();
    if (!this.canPlay || !this.play) {
      return;
    }
    const ctx = Object.assign(
      {
        lastHeartBeatTime: Date.now(),
      },
      this.mWatchContext
    );
    this.isBlock = false;
    this.mCurrentIframeMessageListener = this.getListener(ctx);
    window.addEventListener("message", this.mCurrentIframeMessageListener);
    if (this.allowWatch) {
      this.mWatchDog = window.setInterval(() => {
        if (!this.mCurrentIframeMessageListener) {
          return;
        }
        if (Date.now() - ctx.lastHeartBeatTime > this.mMaxBitStopTime) {
          console.log("timeout");
          this.isBlock = true;
          this.play = false;
        }
      }, this.mMaxBitStopTime);
    }
  }

  getWatchedContent(content) {
    if (!this.mWatchScript) {
      const taskTypes = {
        heartBeat: Math.random().toString().slice(2, 34),
        sessionStorage_getItem: Math.random().toString().slice(2, 34),
        sessionStorage_setItem: Math.random().toString().slice(2, 34),
        localStorage_getItem: Math.random().toString().slice(2, 34),
        localStorage_openFile: Math.random().toString().slice(2, 34),
        localStorage_setItem: Math.random().toString().slice(2, 34),
      };
      const token = Math.random().toString().slice(2, 34);
      this.mWatchScript = `<script>(async (window)=>{
      const tasks = {}
      window.addEventListener('message', (e)=>{
        const {data} = e
        if(!data || data.token !== "${token}"){
          return
        }
        e.stopPropagation()
        const resolve = data.taskId && tasks[data.taskId]
        if(resolve){
          resolve(data.taskResult)
        }
        if(data.taskId){
          tasks[data.taskId] = null
        }
      })
      const postMessageAsync = (type, data) => new Promise((resolve, reject)=>{
        const taskId = Math.random().toString().slice(2, 34);
        if(tasks[taskId]){
          reject('Busy')
          return
        }
        window.parent.postMessage({
          token: '${token}',
          taskId: taskId,
          taskType: type,
          taskData:data
        }, '${window.location.origin}')
        tasks[taskId] = resolve
      })
      window.$sessionStorage = {
        getItem : (key) => postMessageAsync("${taskTypes.sessionStorage_getItem}", key),
        setItem : (key, value) => postMessageAsync("${taskTypes.sessionStorage_setItem}", [key, value])
      }
      window.$localStorage = {
        getItem : (key) => postMessageAsync("${taskTypes.localStorage_getItem}", key),
        openFile : (type, resultType) => postMessageAsync("${taskTypes.localStorage_openFile}", [type, resultType]),
        setItem : (key, value) => postMessageAsync("${taskTypes.localStorage_setItem}", [key, value])
      }
      sleep = (timeout)=>new Promise(resolve=> setTimeout(resolve, timeout))
      while(${this.allowWatch}){
        await postMessageAsync("${taskTypes.heartBeat}")
        await sleep(${this.mBitTime})
      }
    })(window)
  </script>`;
      this.mWatchContext = { token, taskTypes };
    }
    return this.canPlay ? this.mWatchScript + content : content;
  }

  private mWatchContext: any;

  mGetSecureKey(key) {
    return `${this.id}_${key}`;
  }

  getListener(ctx) {
    const { token, taskTypes } = ctx;
    return async (ev) => {
      if (!ev.data || ev.data.token !== token) {
        return;
      }
      ev.stopPropagation();
      const w = ev.source as Window;
      const reply = (result) =>
        w.postMessage(
          {
            token,
            taskId: ev.data.taskId,
            taskResult: result,
          },
          "*"
        );
      if (!this.play || this.pause) {
        reply(null);
        return;
      }
      let res;
      switch (ev.data.taskType) {
        case taskTypes.heartBeat:
          ctx.lastHeartBeatTime = Date.now();
          reply(null);
          return;
        case taskTypes.sessionStorage_getItem:
          res =
            this.id &&
            window.sessionStorage.getItem(this.mGetSecureKey(ev.data.taskData));
          reply(res);
          return;
        case taskTypes.sessionStorage_setItem:
          if (this.id) {
            window.sessionStorage.setItem(
              this.mGetSecureKey(ev.data.taskData[0]),
              ev.data.taskData[1]
            );
          }
          reply(null);
          return;
        case taskTypes.localStorage_getItem:
          res =
            this.id &&
            window.localStorage.getItem(this.mGetSecureKey(ev.data.taskData));
          reply(res);
          return;
        case taskTypes.localStorage_openFile:
          res = await this.htmlAppService.openFileForApp(
            this.id,
            ev.data.taskData[0],
            ev.data.taskData[1]
          );
          reply(res);
          return;
        case taskTypes.localStorage_setItem:
          if (this.id) {
            window.localStorage.setItem(
              this.mGetSecureKey(ev.data.taskData[0]),
              ev.data.taskData[1]
            );
          }
          reply(null);
          return;
      }
      reply(null);
    };
  }

  getDataUrl(content) {
    return "data:text/html;charset=utf-8," + encodeURIComponent(content);
  }

  parseContent() {
    let content = this.content || "";
    let noScriptContent = this.removeScript(content);
    this.canPlay =
      content.length > 0 && noScriptContent.length < content.length;
    const dataUrl = this.getDataUrl(
      this.pythonService
        ? this.pythonService.getContent(content)
        : this.getWatchedContent(content)
    );
    if (this.pythonService) {
      this.pythonService.getHost = this.getPythonServiceHost;
    }
    this.popContentUrl = this.window.chrome ? null : this.getDataUrl(content);
    this.popContentUrlChange.emit(this.popContentUrl);
    this.contentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);

    this.nonScriptContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.getDataUrl(noScriptContent)
    );
    this.mdSource = "```html\n" + this.content + "\n```";
    this.startWatch();
  }

  getPythonServiceHost = async (): Promise<HTMLIFrameElement> => {
    if (this.iframeRef && this.iframeRef.nativeElement) {
      return this.iframeRef.nativeElement;
    }
    const promise = new Promise<HTMLIFrameElement>(
      (resolve) => (this.resolveWhenIframeLoaded = resolve)
    );
    setTimeout(() => (this.play = true), 0);
    return promise;
  };

  ngAfterViewChecked() {
    if (
      this.iframeRef &&
      this.iframeRef.nativeElement &&
      this.resolveWhenIframeLoaded
    ) {
      const resolve = this.resolveWhenIframeLoaded;
      this.resolveWhenIframeLoaded = null;
      resolve(this.iframeRef.nativeElement);
    }
  }

  removeScript(html) {
    return html && html.replace(/<script(.|[\r\n])*?<\/script\s?>/gim, "");
  }
}
