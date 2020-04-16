import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import { MdReloadService } from "src/app/services/md-reload.service";
import { EditorBase } from "../editor-base";
import { Observable } from "rxjs";

@Component({
  selector: "app-simple-editor",
  templateUrl: "./simple-editor.component.html",
  styleUrls: ["./simple-editor.component.scss"],
})
export class SimpleEditorComponent extends EditorBase implements OnInit {
  editorOptions = {
    theme: "vs",
    lineNumbers: false,
    wordWrap: "on",
    contextmenu: false,
    minimap: { enabled: false },
    language: "",
  };

  constructor(mdReload: MdReloadService, cdRef: ChangeDetectorRef) {
    super(mdReload, cdRef);
  }

  @Input() errored: (error: string) => Observable<any>;

  ngOnInit() {
    this.editorOptions.language = this.type;
  }

  getContent = () => this.changedContent;
}
