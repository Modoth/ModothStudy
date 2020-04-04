import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node } from 'src/app/models/node';
import { NotifyService } from 'src/app/services/notify.service';
import { NodeItem, NodesService } from 'src/app/apis';
import { tap, switchMap, filter, toArray } from 'rxjs/operators'
import { throwError, from } from 'rxjs';

@Component({
  selector: 'app-node-header',
  templateUrl: './node-header.component.html',
  styleUrls: ['./node-header.component.scss']
})
export class NodeHeaderComponent {

  @Input() isOwnNode: boolean
  @Input() parentNode: Node;
  @Input() currentNode: Node;
  public selectFloderId: string
  @Output() afterRenamed: EventEmitter<any> = new EventEmitter()
  @Output() afterMoved: EventEmitter<any> = new EventEmitter()
  public canMoveTo = false;
  public initSelectedNode: Node;

  public get backPath() {
    return `/library/list/${this.parentNode && this.parentNode.id || '0'}/ /0`
  }

  constructor(public nodesApi: NodesService,
    public notifyService: NotifyService) { }

  public selectedChanged(selected: NodeItem) {
    if (!selected) {
      this.selectFloderId = null;
      this.canMoveTo = false;
      return
    }
    let excludePathPrefix = this.currentNode.path;
    this.selectFloderId = selected && selected.id;
    this.canMoveTo = selected != null && selected.type == NodeItem.TypeEnum.Folder
      && (this.parentNode ? this.parentNode.id != selected.id : true)
      && (excludePathPrefix == null || !selected.path.startsWith(excludePathPrefix));
  }

  public moveFloder() {
    var parentId = this.parentNode && this.parentNode.id;
    if (parentId == this.selectFloderId) {
      return;
    }
    this.nodesApi.move(this.currentNode.id, this.selectFloderId).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
      })
    ).subscribe(() => this.afterMoved.emit(), error => this.notifyService.toast(error))
  }

  public nodeFilter = (node: NodeItem) => {
    if (node.type != NodeItem.TypeEnum.Folder) {
      return false;
    }
    if (node.id == this.currentNode.id) {
      return false;
    }
    return true;
  }

  public async rename(data: { name }) {
    const newNodeName = data.name.trim();
    if (newNodeName === '' || this.currentNode.name === newNodeName) {
      return;
    }
    this.nodesApi.rename(this.currentNode.id, newNodeName).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
      })
    ).subscribe(() => {
      this.currentNode.name = newNodeName;
      if (this.currentNode.type === NodeItem.TypeEnum.Folder) {
        this.afterRenamed.emit()
      }
    }, error => this.notifyService.toast(error))
  }
}
