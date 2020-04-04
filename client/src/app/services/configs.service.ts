import { Injectable } from '@angular/core';
import { ConfigsService as ConfigsApi } from '../apis';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { shareReplay, tap, switchMap } from 'rxjs/operators';
import { Key } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  public _configs: {
    [key: string]: string;
  };

  public configSubDict = new Map<string, BehaviorSubject<string>>();
  public _configAll$: Observable<{ [key: string]: string; }>

  constructor(public configsApi: ConfigsApi) {
    this._configAll$ = this.configsApi.all().pipe(
      tap(config => {
        this.configSubDict.forEach((v, k) => {
          v.next(config[k]);
        });
      }),
      shareReplay(1))
    this._configAll$.subscribe(config => { this._configs = config })
  }

  configs = (key: string): Observable<string> => {
    this.loadConfigs().subscribe( config => this._configs = this._configs || config)
    if (!this.configSubDict.has(key)) {
      const value = this._configs ? this._configs[key] : null;
      this.configSubDict.set(key, new BehaviorSubject<string>(value));
    }
    return this.configSubDict.get(key);
  }

  loadConfigs(): Observable<{ [key: string]: string; }> {
    if (this._configs) {
      return of(this._configs)
    }
    return this._configAll$
  }

  getConfig(key: string): Observable<string> {
   return this.loadConfigs().pipe(
      tap(config => {this._configs = this._configs || config}),
      switchMap(config => of(null ? key : this._configs[key]))
    )
  }

  setConfig(key: string, value: string): Observable<any> {
    return this.loadConfigs().pipe(
      tap(config => {
        this._configs = this._configs || config
        this._configs[key] = value;
        if (this.configSubDict.has(key)) {
          this.configSubDict.get(key).next(value);
        }
      }),
      switchMap(() => of(true))
    )
  }
}
