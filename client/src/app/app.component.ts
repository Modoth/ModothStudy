import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { AppService } from "./services/app.service";
import { ConfigsService } from "./services/configs.service";
import { Configs } from "./apis";
import { copy } from "./shared/copy";
import { NotifyService } from "./services/notify.service";
import { PopupComponent } from "./shared/popup/popup.component";
import { Subscription, forkJoin } from "rxjs";
import { HtmlAppService } from "./services/html-app.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    public appService: AppService,
    public configsService: ConfigsService,
    private notifyService: NotifyService,
    private htmlAppService: HtmlAppService
  ) {
    this.htmlAppService.injectOpenFile(this.openFileForApp);
  }
  // Todo: 主题
  @ViewChild("appBg") bgRef: ElementRef<HTMLElement>;

  @HostListener("code-menu-click", ["$event"])
  mOnCodeMenuClick(e: CustomEvent) {
    const code: HTMLPreElement = e.target as HTMLPreElement;
    copy(code.innerText);
    this.notifyService.toast(Configs.UiLangsEnum.SuccessToCopy);
    e.stopPropagation();
  }

  public navbarVisibility = true;
  title = "modoth";
  @ViewChild("iptFile") iptFile: ElementRef<HTMLInputElement>;
  @ViewChild("openFilePopup") openFilePopup: PopupComponent;
  async ngOnInit() {
    this.appService.init();
    this.appService.tryLogin().subscribe();
    this.appService.navbarVisibility.subscribe(
      (v) => (this.navbarVisibility = v)
    );
    this.configsService
      .configs(Configs.AppConfigsEnum.BG.toString())
      .subscribe((bg) => {
        this.bgRef.nativeElement.style.background = bg
          ? `url(${bg}) center/60% no-repeat`
          : "";
      });
  }

  openFileForApp = (
    title: string | string[],
    mimeType: string,
    resultType: string
  ) => {
    return new Promise((resolve) => {
      if (!this.openFilePopup || !this.iptFile.nativeElement) {
        resolve(null);
        return;
      }
      let cancle: Subscription;
      let saved: Subscription;
      const unsubscribe = () => {
        cancle.unsubscribe();
        saved.unsubscribe();
      };
      this.openFilePopup.title = title;
      cancle = this.openFilePopup.canceled.subscribe(() => {
        unsubscribe();
        resolve(null);
      });
      saved = this.openFilePopup.saved.subscribe(() => {
        unsubscribe();
      });
      this.iptFile.nativeElement.accept = mimeType;
      this.iptFile.nativeElement.onchange = () => {
        this.openFilePopup.save();
        setTimeout(() => {
          const file = this.iptFile.nativeElement.files[0];
          const reader = new FileReader();
          const readAs = `readAs${resultType}`;
          if (!reader[readAs]) {
            resolve({ file: Object.assign({}, file) });
          }
          reader.onabort = () => resolve(null);
          reader.onerror = () => resolve(null);
          reader.onload = () => {
            resolve({
              file: Object.assign({}, file),
              data: reader.result,
            });
          };
          reader[readAs](file);
          this.iptFile.nativeElement.value = null;
        }, 50);
      };
      this.openFilePopup.show();
    });
  };
}
