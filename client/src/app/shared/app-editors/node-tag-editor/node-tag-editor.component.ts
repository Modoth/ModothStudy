import {
  Component,
  Output,
  EventEmitter,
  OnChanges,
  Input,
  SimpleChanges,
} from "@angular/core";
import { NodeTag, TagItem, TagsService, Configs } from "src/app/apis";
import { NotifyService } from "src/app/services/notify.service";
import { isNullOrSpace } from "src/app/utils/util";
import { tap } from "rxjs/operators";
import { throwError, empty, Observable, timer } from "rxjs";

@Component({
  selector: "app-node-tag-editor",
  templateUrl: "./node-tag-editor.component.html",
  styleUrls: ["./node-tag-editor.component.scss"],
})
export class NodeTagEditorComponent implements OnChanges {
  @Input() nodeTags: NodeTag[];

  @Output() closed: EventEmitter<any> = new EventEmitter();

  @Output() tagRemoved: EventEmitter<TagItem> = new EventEmitter();

  @Output() tagAdded: EventEmitter<{
    tag: TagItem;
    value: string;
  }> = new EventEmitter();

  addedTags: { tag: TagItem; nodeTag: NodeTag }[];

  allTags: Map<string, { added: boolean; tag: TagItem }>;

  tags: any;

  TagType = TagItem.TypeEnum;

  constructor(
    public tagsApi: TagsService,
    public notifyService: NotifyService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ("nodeTags" in changes) {
      this.updateTags();
    }
  }

  updateTags() {
    this.loadTags()
      .pipe(
        tap(() => {
          const addedTags: { tag: TagItem; nodeTag: NodeTag }[] = [];
          for (const tag of this.tags) {
            tag.added = false;
          }
          if (this.nodeTags !== null) {
            for (const nodeTag of this.nodeTags) {
              const tag = this.allTags.get(nodeTag.id);
              tag.added = true;
              addedTags.push({ tag: tag.tag, nodeTag });
            }
          }

          this.addedTags = addedTags;
          this.tags = Array.from(this.allTags.values());
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  }

  loadTags(): Observable<any> {
    if (this.allTags) {
      return timer(0);
    }
    return this.tagsApi.allTags().pipe(
      tap((apiRes) => {
        if (!apiRes.result) throw apiRes.error;
        this.allTags = apiRes.data.data.reduce(
          (m, tag) => m.set(tag.id, { tag, added: false }),
          new Map()
        );
        this.tags = Array.from(this.allTags.values());
      })
    );
  }
  public readonly okStr = Configs.UiLangsEnum.Ok;
  public editTag: TagItem;
  public selectTag: string = "";
  public get enumList() {
    if (!this.editTag || !this.editTag.values) return [];
    return this.editTag.values
      .split(" ")
      .map((v) => v.trim())
      .filter((v) => v !== "");
  }
  addBoolTag(tag: TagItem, value: string) {
    this.tagAdded.emit({ tag, value: null });
  }
  addEnumTag(value) {
    if (isNullOrSpace(value)) return;
    this.tagAdded.emit({ tag: this.editTag, value });
  }
  addTextTag(data: { value }) {
    if (isNullOrSpace(data.value)) return;
    this.tagAdded.emit({ tag: this.editTag, value: data.value });
  }

  removeTag(tag: TagItem) {
    this.tagRemoved.emit(tag);
  }
}
