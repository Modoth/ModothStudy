import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node } from 'src/app/models/node';
import { NodeItem, LoginUser } from 'src/app/apis';

@Component({
  selector: 'app-node-item',
  templateUrl: './node-item.component.html',
  styleUrls: ['./node-item.component.scss']
})
export class NodeItemComponent implements OnInit {
  @Input() node: Node
  @Input() summary = false;
  @Input() loginUser: LoginUser;
  @Input() isTopLevel: boolean = false
  @Input() isOwnNode: boolean
  @Output() deleted: EventEmitter<any> = new EventEmitter()
  @Output() selected: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  public get icon() {
    var type = this.node.reference ? this.node.reference.type : this.node.type
    switch (type) {
      case NodeItem.TypeEnum.Folder:
        return "folder";
      case NodeItem.TypeEnum.Blog:
        return "description";
      default:
        return "broken_image";
    }
  }
}
