import { Component, OnInit, SimpleChanges, Input } from "@angular/core";
import { Observable } from "rxjs";
import { DataConvertService } from "src/app/services/data-convert.service";

@Component({
  selector: "app-wrapmd-viewer",
  templateUrl: "./wrapmd-viewer.component.html",
  styleUrls: ["./wrapmd-viewer.component.scss"],
})
export class WrapmdViewerComponent implements OnInit {
  @Input() options: any;

  @Input() content: string;

  @Input() id: string;

  @Input() type: string;

  appContent: string;

  mergedContent: string;

  fullscreen = false;

  menus: { icon: string; onClick: () => any }[];

  summary = false;

  markdownContent: string;

  showSource = false;

  hideSource = false;

  showMenus = false;

  showBorder = false;

  public popContentUrl: string;

  getApp: () => Observable<string>;

  appOptions: any = {};

  public maxLine = 3;

  constructor(private converter: DataConvertService) {}

  ngOnInit() {}

  openContentUrl() {
    window.open(this.popContentUrl, "_blank");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("options" in changes && this.options) {
      if (this.options.summary) {
        this.summary = this.options.summary.value;
      }
      this.showMenus = this.showMenus && !this.summary;
      if (this.options.showMenus) {
        this.showMenus = this.options.showMenus.value;
      }
      if (this.options.showBorder) {
        this.showBorder = this.options.showBorder.value;
      }
      if (this.options.getApp) {
        this.getApp = this.options.getApp.value;
      }
      if (this.options.menus) {
        this.menus = this.options.menus.value;
      }
      if (this.options.hideSource) {
        this.hideSource = this.options.hideSource.value;
      }
    }
    if ("content" in changes) {
      this.markdownize();
      this.appContent = null;
      if (this.getApp) {
        this.appOptions = {
          showBorder: { value: false },
          play: this.options.play,
          pause: this.options.pause,
          sandBox: this.options.sandBox,
        };
        this.getApp().subscribe((content) => {
          this.appContent = content;
          if (this.appContent) {
            this.mergedContent =
              this.converter.toHtmlStr(
                this.content,
                this.getTrueContentType(this.type)
              ) + this.appContent;
          }
        });
      }
    }
  }

  getTrueContentType(type) {
    const map = {
      h5: "html",
    };
    return map[type] || type;
  }

  markdownize() {
    this.markdownContent = null;
    const content =
      this.content && this.summary
        ? this.getSummary(this.content)
        : this.content || "";
    this.markdownContent =
      "```" + this.getTrueContentType(this.type) + "\n" + content + "\n```";
  }
  getSummary(content: string) {
    let lineRemain = this.maxLine;
    const lines = [];
    for (const line of content.split("\n")) {
      lines.push(line);
      if (line.trim() !== "") {
        lineRemain--;
        if (lineRemain === 0) {
          break;
        }
      }
    }
    return lines.join("\n");
  }
}
