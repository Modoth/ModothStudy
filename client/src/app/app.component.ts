import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "./services/app.service";
import { ConfigsService } from "./services/configs.service";
import { Configs } from "./apis";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    public appService: AppService,
    public configsService: ConfigsService
  ) {}
  // Todo: 主题
  @ViewChild("appBg") bgRef: ElementRef<HTMLElement>;

  public navbarVisibility = true;
  public CONFIG_ICP: string = "";
  title = "modoth-study";
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
    this.configsService
      .configs(Configs.AppConfigsEnum.ICP.toString())
      .subscribe((icp) => {
        this.CONFIG_ICP = icp;
      });
  }
}
