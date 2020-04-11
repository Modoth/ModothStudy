import { Injectable } from "@angular/core";
import { ConfigsService } from "./configs.service";
import { Configs, NodeTag, NodesService as NodesApi } from "../apis";
import { Observable, of, iif, empty } from "rxjs";
import { switchMap, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ScriptAppService {
  getNodeApp = (
    context: { appTag: string; apps: Map<string, string> },
    tags: NodeTag[],
    nodesApi: NodesApi,
    configsService: ConfigsService
  ) => (): Observable<string | {}> => {
    return this.getScriptType(tags, configsService).pipe(
      switchMap((appType) =>
        iif(
          () => !appType,
          null,
          iif(
            () => context.apps.has(appType),
            of(context.apps.get(appType)),
            iif(
              () => !!context.appTag,
              this.getAppContent(context.appTag, appType, nodesApi, context),
              this.getAppTag(configsService).pipe(
                switchMap((tag) =>
                  this.getAppContent(tag as string, appType, nodesApi, context)
                )
              )
            )
          )
        )
      )
    );
  };

  getAppContent = (
    tagName: string,
    type: string,
    nodesApi: NodesApi,
    context: { appTag: string; apps: Map<string, string> }
  ): Observable<string> => {
    if (!tagName) return empty();
    return nodesApi.getBlogsByTag(tagName, type, 1).pipe(
      map((apiRes) =>
        apiRes ? apiRes.data.data[0] && apiRes.data.data[0].content : null
      ),
      tap((content) => content && context.apps.set(type, content as string))
    );
  };

  getAppTag = (configsService: ConfigsService) => {
    return configsService.getConfig(Configs.AppConfigsEnum.APPTAG.toString());
  };

  getScriptType = (
    tags: NodeTag[],
    configsService: ConfigsService
  ): Observable<string> => {
    return configsService
      .getConfig(Configs.AppConfigsEnum.SCRIPTTAG.toString())
      .pipe(
        map((tagName) => tags.find((t) => t.name === tagName)),
        switchMap((tag) => of(tag && tag.value))
      );
  };
}
