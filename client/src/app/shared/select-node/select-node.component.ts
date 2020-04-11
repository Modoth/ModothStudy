import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { Node } from "src/app/models/node";
import { NodeItem, NodesService } from "src/app/apis";
import { NotifyService } from "src/app/services/notify.service";
import { tap, switchMap, filter, toArray } from "rxjs/operators";
import { throwError, from } from "rxjs";

@Component({
  selector: "app-select-node",
  templateUrl: "./select-node.component.html",
  styleUrls: ["./select-node.component.scss"],
})
export class SelectNodeComponent implements OnInit {
  reload(initNode: NodeItem): void {
    this.getSubFloder(initNode);
  }

  constructor(
    public nodesApi: NodesService,
    public notifyService: NotifyService
  ) {}

  ngOnInit() {}

  public parents: NodeItem[];
  public children: NodeItem[];
  @Output() selectedChange = new EventEmitter<NodeItem>();
  public currentNode: NodeItem;
  @Input() nodeFilter: (NodeItem) => boolean = () => true;

  public getSubFloder = (node: NodeItem) => {
    if (node) {
      var contentType = node.reference ? node.reference.type : node.type;
      if (contentType == NodeItem.TypeEnum.Blog) {
        var parent = this.parents;
        parent.push(node);
        this.parents = parent;
        this.currentNode = node;
        this.selectedChange.emit(this.currentNode);
        this.children = [];
        return;
      }
    }
    var id = node && node.reference ? node.reference.id : node && node.id;
    this.nodesApi
      .nodeDir(id)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.parents = apiRes.data.supnodes;
          this.currentNode = this.parents[this.parents.length - 1];
          this.selectedChange.emit(this.currentNode);
        }),
        switchMap((apiRes) => from(apiRes.data.subnodes)),
        filter((n) => this.nodeFilter(n)),
        toArray()
      )
      .subscribe(
        (subs) => (this.children = subs),
        (error) => this.notifyService.toast(error)
      );
  };
}
