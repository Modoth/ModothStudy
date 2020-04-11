import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-image-viewer",
  templateUrl: "./image-viewer.component.html",
  styleUrls: ["./image-viewer.component.scss"],
})
export class ImageViewerComponent {
  @Input() imgs: Array<any> = [];
  @Output() closed: EventEmitter<any> = new EventEmitter();
  public get current(): any {
    return this.imgs && this.imgs.length > 0 ? this.imgs[0] : "";
  }
  constructor() {}
}
