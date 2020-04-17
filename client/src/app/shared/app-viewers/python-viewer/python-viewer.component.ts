import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  IPythonService,
  IframePythonService,
} from "../../python-service/python-service";
import { Observable } from "rxjs";

@Component({
  selector: "app-python-viewer",
  templateUrl: "./python-viewer.component.html",
  styleUrls: ["./python-viewer.component.scss"],
})
export class PythonViewerComponent implements OnInit, OnChanges {
  @Input() options: any;

  @Input() id: string;

  @Input() content: string;

  fullscreen = false;

  loopPlay = false;

  appContent: string;

  menus: { icon: string; onClick: () => any }[];

  summary = false;

  markdownContent: string;

  showRun = true;

  isRunning = false;

  showTerminal = false;

  showMenus = false;

  showBorder = false;

  appOptions: any = {};

  getApp: () => Observable<string>;

  pythonService: IPythonService;

  public maxLine = 3;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if ("options" in changes && this.options) {
      if (this.options.summary) {
        this.summary = this.options.summary.value;
      }
      this.showMenus = this.showMenus && !this.summary;
      if (this.options.showRun) {
        this.showRun = this.options.showRun.value;
      }
      if (this.options.showMenus) {
        this.showMenus = this.options.showMenus.value;
      }
      if (this.options.showBorder) {
        this.showBorder = this.options.showBorder.value;
      }
      if (this.options.menus) {
        this.menus = this.options.menus.value;
      }
      if (this.options.pythonService) {
        this.pythonService = this.options.pythonService.value;
      }
      if (this.options.getApp) {
        this.getApp = this.options.getApp.value;
      }
      if (this.options.loopPlay) {
        this.loopPlay = this.options.loopPlay.value;
      }
    }
    if ("content" in changes) {
      this.markdownize();
      this.appContent = null;
      if (this.getApp) {
        if (!this.pythonService) {
          this.pythonService = new IframePythonService();
        }
        this.appOptions = {
          pythonService: { value: this.pythonService },
          showBorder: { value: false },
        };
        this.getApp().subscribe((content) => {
          this.appContent = content;
          if (this.loopPlay) {
            this.isRunning = true;
          }
        });
      }
    }
  }

  markdownize() {
    this.markdownContent = null;
    const content =
      this.content && this.summary
        ? this.getSummary(this.content)
        : this.content || "";
    this.markdownContent = "```python\n" + content + "\n```";
  }
  getSummary(content: string) {
    let lineRemain = this.maxLine;
    const lines = [];
    let needCloseString = false;
    const stringTag = "'''";
    for (let line of content.split("\n")) {
      lines.push(line);
      line = line.trim();
      if (line.startsWith(stringTag)) {
        needCloseString = !needCloseString;
      }
      if (line !== "") {
        lineRemain--;
        if (lineRemain === 0) {
          break;
        }
      }
    }
    if (needCloseString) {
      lines.push("      ...");
      lines.push(stringTag);
    }
    return lines.join("\n");
  }
}
