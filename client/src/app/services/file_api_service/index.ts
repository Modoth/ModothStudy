import { Injectable } from "@angular/core";
import { ApiResultString } from "src/app/apis";
import { Enum_Request_Method } from "./enum.request.method";
import fileApiUrls from "./file.urls";
import { isNullOrSpace } from "src/app/utils/util";
import { Observable, from, of } from "rxjs";
import { map, flatMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
class FileApiService {
  public _getFetchUrl(url: string, params: object): string {
    if (isNullOrSpace(params)) return url;
    let paramsArr = [];
    for (const [key, value] of Object.entries(params)) {
      paramsArr.push(`${key}=${value}`);
    }
    return url + "?" + paramsArr.join("&");
  }
  public fetch(
    urlObj: { url: string; method: Enum_Request_Method },
    params: { blob: Blob; serch?: object }
  ): Observable<ApiResultString> {
    let { url, method } = urlObj;
    let { blob, serch } = params;
    const fd = new FormData();
    fd.append("file", blob);
    return from(
      fetch(this._getFetchUrl(url, serch), {
        method,
        body: fd,
      })
    ).pipe(flatMap((res) => from(res.json())));
  }
}

export { FileApiService, fileApiUrls };
