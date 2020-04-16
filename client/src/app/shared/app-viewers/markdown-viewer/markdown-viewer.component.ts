import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
} from "@angular/core";
import { MdReloadService } from "src/app/services/md-reload.service";
import { copy } from "../../copy";
import { NotifyService } from "src/app/services/notify.service";
import { Configs } from "src/app/apis";

@Component({
  selector: "app-markdown-viewer",
  templateUrl: "./markdown-viewer.component.html",
  styleUrls: ["./markdown-viewer.component.scss"],
})
export class MarkdownViewerComponent implements OnInit, OnChanges {
  @Input() options: any;

  @Input() content: string;

  summary = false;

  summaryImg: string;

  hasMore = false;

  summaryVideo: string;

  summaryContent: string;

  public matchImg = /!\[.*\]\((.*)\)/;

  public matchVideo = /<video src="(.*)"/;

  public maxLength = 3;

  public maxCharLength = 128;

  @HostListener("code-menu-click", ["$event"])
  mOnCodeMenuClick(e: CustomEvent) {
    const code: HTMLPreElement = e.target as HTMLPreElement;
    copy(code.innerText);
    this.notifyService.toast(Configs.UiLangsEnum.SuccessToCopy);
    e.stopPropagation();
  }

  constructor(
    public mdReload: MdReloadService,
    private notifyService: NotifyService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if ("options" in changes && this.options && this.options.summary) {
      this.summary = this.options.summary.value;
    }
    if ("content" in changes) {
      this.summarizeContent();
      this.mdReload.reload();
    }
  }

  public summarizeContent() {
    this.summaryImg = null;
    this.summaryVideo = null;
    this.summaryContent = null;
    this.hasMore = false;
    const summaryLines = [];
    if (!this.summary) {
      return;
    }
    let remainCharLength = this.maxCharLength;
    let remainLine = this.maxLength;
    const lines = this.content.split("\n");
    let codeBlockBoundary = 0;
    for (const line of lines) {
      const trimLine = line.trim();
      const imgMatch = trimLine.match(this.matchImg);
      if (imgMatch && imgMatch[1] != null) {
        if (this.summaryImg == null) {
          this.summaryImg = imgMatch[1];
        }
        continue;
      }
      const videoMatch = trimLine.match(this.matchVideo);
      if (videoMatch && videoMatch[1] != null) {
        if (this.summaryVideo == null) {
          this.summaryVideo = videoMatch[1];
        }
        continue;
      }
      if (remainCharLength < trimLine.length) {
        summaryLines.push(line.slice(0, remainCharLength));
      } else {
        summaryLines.push(line);
      }
      if (trimLine.startsWith("```")) {
        codeBlockBoundary++;
      }
      if (trimLine !== "" && !trimLine.startsWith("```")) {
        remainCharLength -= trimLine.length;
        remainLine--;
      }
      if (remainLine <= 0 || remainCharLength <= 0) {
        let lastLine = summaryLines[summaryLines.length - 1];
        while (lastLine != null && lastLine.trim() === "") {
          summaryLines.pop();
          lastLine = summaryLines[summaryLines.length - 1];
        }
        if (codeBlockBoundary % 2) {
          summaryLines.push("\n```");
        }
        this.hasMore = true;
        break;
      }
    }
    this.summaryContent = summaryLines.join("\n");
    if (this.summaryContent.trim() === "") {
      this.summaryContent = null;
    }
  }
}
