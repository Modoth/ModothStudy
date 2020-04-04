import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigsService } from './configs.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(public snackBar: MatSnackBar, public configsService: ConfigsService) { }

  public toast(key: any) {
    this.configsService.getConfig(key.toString()).subscribe( value => {
      this.snackBar.open(value, null, {
        duration: 1000,
      })
    })
  }
}
