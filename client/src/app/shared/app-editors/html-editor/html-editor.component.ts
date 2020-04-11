import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy,
} from "@angular/core";
import { MdReloadService } from "src/app/services/md-reload.service";
import { EditorBase } from "../editor-base";
import { Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-html-editor",
  templateUrl: "./html-editor.component.html",
  styleUrls: ["./html-editor.component.scss"],
})
export class HtmlEditorComponent extends EditorBase
  implements OnInit, OnDestroy {
  @Input() maxImageSize: number;

  @Input() imageInserted: (Blob) => Observable<string>;

  @Input() errored: (error: string) => Observable<any>;

  insertingImage: Blob;

  editorOptions = {
    theme: "vs",
    lineNumbers: false,
    wordWrap: "on",
    contextmenu: false,
    minimap: { enabled: false },
    language: this.type || "html",
  };

  constructor(mdReload: MdReloadService, cdRef: ChangeDetectorRef) {
    super(mdReload, cdRef);
    this.livePreview = false;
  }

  ngOnInit() {}
  ngOnDestroy() {
    if (this.imgSubscription) this.imgSubscription.unsubscribe();
  }
  public imgSubscription: Subscription;
  insertImage = (blob: Blob) => {
    if (blob == null) {
      return;
    }
    this.imgSubscription = this.imageInserted(blob)
      .pipe(
        tap((url) => {
          if (!url) return;
          let insertText = "";
          let fileType: string = blob.type;
          fileType = fileType.split("/")[0].toLocaleLowerCase();
          switch (fileType) {
            case "video":
              insertText = `<video src="${url}#t=0.1" controls ></video>`;
              break;
            default:
              insertText = `<img src="${url}" ></img>`;
          }
          this.insertText(insertText);
        })
      )
      .subscribe();
  };
}
