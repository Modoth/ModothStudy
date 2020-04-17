import { Pipe, PipeTransform } from "@angular/core";
import { ConfigsService } from "../services/configs.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { formatString } from "../shared/format-string";

@Pipe({
  name: "lang",
})
export class LangPipe implements PipeTransform {
  constructor(public configsService: ConfigsService) {}
  transform(data: string | string[]): Observable<string> {
    if (data === undefined || data === null) {
      return of("");
    }
    if (typeof data === "string") {
      return this.configsService.configs(data);
    } else {
      const key = data[0];
      const args = data.slice(1);
      return this.configsService
        .configs(key)
        .pipe(map((c) => c && formatString(c, ...args)));
    }
  }
}
