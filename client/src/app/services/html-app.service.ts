import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Configs, NodesService } from "../apis";

@Injectable({
  providedIn: "root",
})
export class HtmlAppService {
  constructor(private nodesService: NodesService) {}

  currentApp: string = null;

  private openFile: (
    title: string | string[],
    mimeType: string,
    resultType: string
  ) => Promise<any>;

  currentApp$ = new Subject<string>();

  injectOpenFile(
    openFile: (
      title: string | string[],
      mimeType: string,
      resultType: string
    ) => Promise<any>
  ) {
    this.openFile = openFile;
  }

  async openFileForApp(id: string, mimeType: string, resultType: string) {
    const res = await this.nodesService.getBlog(id).toPromise();
    if (!res || !res.result || !res.data || !res.data.name) {
      return null;
    }
    return this.openFile(
      [Configs.UiLangsEnum.OpenFileFromThisApp, res.data.name],
      mimeType,
      resultType
    );
  }

  setCurrentApp(id: string) {
    if (this.currentApp === id) {
      return;
    }
    this.currentApp = id;
    this.currentApp$.next(id);
  }
}
