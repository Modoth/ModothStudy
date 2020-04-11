import { Pipe, PipeTransform } from "@angular/core";
import { ConfigsService } from "../services/configs.service";
import { BehaviorSubject, Observable } from "rxjs";

@Pipe({
  name: "lang",
})
export class LangPipe implements PipeTransform {
  constructor(public configsService: ConfigsService) {}
  transform(key: string): Observable<string> {
    return this.configsService.configs(key);
  }
}
