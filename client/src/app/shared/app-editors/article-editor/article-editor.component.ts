import { Component, OnInit, Inject, Input, OnChanges } from "@angular/core";
import { IframePythonService } from "../../python-service/python-service";
import { Observable } from "rxjs";

export interface ArticleEditorModel {
  maxImageSize: number;

  content: string;

  id: string;

  type: string;

  solutionToType?: string | undefined;

  solutionToContent?: string | undefined;

  imageInserted: (Blob) => Observable<string>;

  errored: (str) => void;

  saved: (str) => void;

  closed: () => void;
}

@Component({
  selector: "app-article-editor",
  templateUrl: "./article-editor.component.html",
  styleUrls: ["./article-editor.component.scss"],
})
export class ArticleEditorComponent implements OnInit, OnChanges {
  @Input() maxImageSize: number;

  @Input() content: string;

  @Input() id: string;


  @Input() type: string;

  @Input() viewerOptions: any;

  @Input() solutionToType?: string | undefined;

  @Input() solutionToContent?: string | undefined;

  @Input() imageInserted: (Blob) => Observable<string>;

  @Input() errored: (str) => void;

  @Input() saved: (str) => void;

  @Input() closed: () => void;

  Object = Object;

  pythonService: { value: IframePythonService };
  public changedContent: string;

  constructor() {
    if (
      this.solutionToType === "html" &&
      this.type === "python" &&
      this.solutionToContent
    ) {
      this.pythonService = { value: new IframePythonService() };
    }
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if ("content" in changes) {
      this.changedContent = this.content;
    }
  }

  ngOnInit() {}
}
