import { Component, OnInit, OnDestroy } from '@angular/core';
import {NodesService, Configs } from 'src/app/apis';
import { NotifyService } from 'src/app/services/notify.service';
import { Router } from '@angular/router';
import { ConfigsService } from 'src/app/services/configs.service';
import { ConvertToNodeModel, Node } from 'src/app/models/node';
import { ScriptAppService } from 'src/app/services/script-app.service';
import { empty } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

   ngOnInit() {
    this.configsService.getConfig(Configs.AppConfigsEnum.DAILYTAG.toString()).pipe(
      switchMap(dailyTag => dailyTag ? this.nodesApi.getBlogsByTag(dailyTag, null, 1) : empty()),
      switchMap(apiRes => apiRes ? ConvertToNodeModel(apiRes.data.data, this.configsService): empty()),
      tap(nodes => {
        if(nodes && nodes.length){
          this.node = nodes[0]
        }
      })
    ).subscribe()
  }

  apps = new Map<string, string>()

  appTag: string = null;

  getNodeApp(node: Node) {
    return this.scriptAppService.getNodeApp(this, node.tags, this.nodesApi, this.configsService);
  }

  search() {
    if (this.filter == null) {
      return;
    }
    let filter = this.filter.trim();
    if (filter === '') {
      return;
    }
    this.router.navigateByUrl(`/library/list/0/${filter}/0`);
  }

  constructor(
    public nodesApi: NodesService,
    public router: Router,
    public configsService: ConfigsService,
    public notifyService: NotifyService,
    public scriptAppService: ScriptAppService
  ) {
  }

  public filter: string;
  public node: Node;

}
