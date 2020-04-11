import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import { MdReloadService } from "src/app/services/md-reload.service";
import { EditorBase } from "../editor-base";
import { IframePythonService } from "../../python-service/python-service";
@Component({
  selector: "app-python-editor",
  templateUrl: "./python-editor.component.html",
  styleUrls: ["./python-editor.component.scss"],
})
export class PythonEditorComponent extends EditorBase implements OnInit {
  @Input() pythonService: IframePythonService;

  public isFullScreen: boolean;
  public popTerminal: boolean = false;
  public showTerminal: boolean = false;

  editorOptions = {
    theme: "vs",
    lineNumbers: false,
    wordWrap: "on",
    contextmenu: false,
    minimap: { enabled: false },
    language: this.type || "python",
  };

  constructor(mdReload: MdReloadService, cdRef: ChangeDetectorRef) {
    super(mdReload, cdRef);
  }

  ngOnInit() {}

  getContent = () => this.changedContent;

  async resetAndRun() {
    const content = this.getContent();
    await this.pythonService.reset();
    await this.pythonService.exec(content);
  }

  reset() {
    this.pythonService.reset();
  }

  onTerminalFocus(focus) {
    if (focus) {
      document.body.scrollTop = 0;
    }
  }
}
