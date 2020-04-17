import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfigsService } from "./configs.service";
import { map } from "rxjs/operators";
import { formatString } from "../shared/format-string";

@Injectable({
  providedIn: "root",
})
export class NotifyService {
  constructor(
    public snackBar: MatSnackBar,
    public configsService: ConfigsService
  ) {}

  public toast(data: string | string[]) {
    let msg;
    if (typeof data === "string") {
      msg = this.configsService.configs(data);
    } else {
      const key = data[0];
      const args = data.slice(1);
      msg = this.configsService
        .configs(key)
        .pipe(map((c) => c && formatString(c, ...args)));
    }
    msg.subscribe((value) => {
      this.snackBar.open(value, null, {
        duration: 1000,
      });
    });
  }
}
