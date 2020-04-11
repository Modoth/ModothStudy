import { Component, ViewChild, OnDestroy } from "@angular/core";
import {
  ConfigsService as ConfigsApi,
  ConfigItem,
  Configs,
  ApiResultString,
} from "src/app/apis";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifyService } from "src/app/services/notify.service";
import { AppService } from "src/app/services/app.service";
import { ConfigsService } from "src/app/services/configs.service";
import {
  FileApiService,
  fileApiUrls,
} from "src/app/services/file_api_service/index";
import { isNullOrSpace } from "src/app/utils/util";
import { PopupComponent } from "src/app/shared/popup/popup.component";
import { tap, switchMap } from "rxjs/operators";
import { throwError } from "rxjs";
@Component({
  selector: "app-manage-configs",
  templateUrl: "./manage-configs.component.html",
  styleUrls: ["./manage-configs.component.scss"],
})
export class ManageConfigsComponent implements OnDestroy {
  @ViewChild("imagePopup") public imagePopup: PopupComponent;
  @ViewChild("textPopup") public textPopup: PopupComponent;
  @ViewChild("booleanPopup") public booleanPopup: PopupComponent;
  constructor(
    public configsApi: ConfigsApi,
    public route: ActivatedRoute,
    public router: Router,
    public appService: AppService,
    public configsService: ConfigsService,
    public notifyService: NotifyService,
    public fileApiService: FileApiService
  ) {}

  public filter;

  public totalCount = 0;

  public ConfigItem = ConfigItem;

  public configs: ConfigItem[];

  public showEditor = false;
  public editData: ConfigItem = {};
  public readonly okStr = Configs.UiLangsEnum.Modify.toString();

  public closeEditor = () => {
    this.showEditor = false;
    this.editData = {};
  };

  public saveConfig = (value) => {
    if (value == null) {
      return;
    }
    this.updateConfig(this.editData, value);
  };

  public openChangeValueDialog = (config: ConfigItem) => {
    this.editData = config;
    const configType = config.configType;
    if (configType === ConfigItem.ConfigTypeEnum.Json) {
      this.showEditor = true;
      return;
    }
    if (configType === ConfigItem.ConfigTypeEnum.Image) {
      this.imagePopup.show();
      return;
    }
    if (configType === ConfigItem.ConfigTypeEnum.Boolean) {
      this.booleanPopup.show();
      return;
    }
    this.textPopup.show();
  };

  saveImage(data) {
    if (isNullOrSpace(data)) return;
    this.fileApiService
      .fetch(fileApiUrls.Configs_UpdateImageValue, {
        blob: data,
        serch: { id: this.editData.id },
      })
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.editData.value = apiRes.data;
        }),
        switchMap((apiRes) =>
          this.configsService.setConfig(this.editData.key, apiRes.data)
        )
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  }

  saveText(data) {
    if (isNullOrSpace(data.value)) return;
    let value = data.value.trim();
    this.updateConfig(this.editData, value);
  }

  public updateConfig(config: ConfigItem, value: string) {
    this.configsApi
      .updateValue(config.id, JSON.stringify(value))
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          config.value = value;
        }),
        switchMap(() => this.configsService.setConfig(config.key, value))
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  }

  public resetConfig = (config: ConfigItem) => {
    this.configsApi
      .resetValue(config.id)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          config.value = null;
        }),
        switchMap(() =>
          this.configsService.setConfig(config.key, config.defaultValue)
        )
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  public search = (data: { filter }) => {
    if (isNullOrSpace(data.filter) && isNullOrSpace(this.filter)) return;
    this.router.navigateByUrl(`/manage/configs/${data.filter.trim() || " "}/0`);
  };

  public reloadConfigs = ({ filter, pageId, pageSize }) => {
    this.configsApi
      .allConfigs(filter, +pageId * pageSize, pageSize)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.configs = apiRes.data.data;
          this.totalCount = apiRes.data.total;
          this.filter = filter.trim();
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  ngOnDestroy() {
    this.textPopup = null;
    this.imagePopup = null;
  }
}
