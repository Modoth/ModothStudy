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
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    public appService: AppService,
    public configsService: ConfigsService,
    private notifyService: NotifyService
  ) {}
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
}
