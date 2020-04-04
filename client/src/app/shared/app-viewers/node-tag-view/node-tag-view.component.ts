import { Component, OnInit, Input } from '@angular/core';
import { NodeTag } from 'src/app/apis';

@Component({
  selector: 'app-node-tag-view',
  templateUrl: './node-tag-view.component.html',
  styleUrls: ['./node-tag-view.component.scss']
})
export class NodeTagViewComponent implements OnInit {

  @Input() tags: NodeTag[];

  TagType = NodeTag.TypeEnum;

  constructor() { }

  ngOnInit() {
  }

}
