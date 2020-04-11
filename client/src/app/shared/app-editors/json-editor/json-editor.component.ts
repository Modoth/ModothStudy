import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import { MdReloadService } from "src/app/services/md-reload.service";
import { EditorBase } from "../editor-base";
import { Observable } from "rxjs";

@Component({
  selector: "app-json-editor",
  templateUrl: "./json-editor.component.html",
  styleUrls: ["./json-editor.component.scss"],
})
export class JsonEditorComponent extends EditorBase implements OnInit {
  editorOptions = {
    theme: "vs",
    lineNumbers: false,
    wordWrap: "on",
    contextmenu: false,
    minimap: { enabled: false },
    language: this.type || "json",
  };

  constructor(mdReload: MdReloadService, cdRef: ChangeDetectorRef) {
    super(mdReload, cdRef);
  }

  @Input() errored: (error: string) => Observable<any>;

  ngOnInit() {}

  getContent = () => this.changedContent;
}
