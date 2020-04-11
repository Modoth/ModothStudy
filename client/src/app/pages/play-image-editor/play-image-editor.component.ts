import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { PopupComponent } from "src/app/shared/popup/popup.component";

@Component({
  selector: "app-play-image-editor",
  templateUrl: "./play-image-editor.component.html",
  styleUrls: ["./play-image-editor.component.scss"],
})
export class PlayImageEditorComponent implements OnInit, OnDestroy {
  @ViewChild("imgPopup") imgPopup: PopupComponent;
  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {}

  public readonly popupOption = {
    maxWidth: "100vw",
    maxHeight: "100vh",
    height: "100%",
    width: "100%",
    panelClass: "image-viewer",
  };

  public blobUrl: string;

  public releaseBlob() {
    if (this.blobUrl) {
      window.URL.revokeObjectURL(this.blobUrl);
    }
    this.blobUrl = null;
  }

  public editingImage: File;
  public imgs: [any];
  public editedImage = async (blob: Blob) => {
    this.editingImage = null;
    if (blob == null) {
      return;
    }
    this.releaseBlob();
    this.blobUrl = window.URL.createObjectURL(blob);
    let imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.blobUrl);
    this.imgs = [imageUrl];
    console.log(this.imgs);
    this.imgPopup.show();
  };

  closed() {
    this.imgPopup.close();
  }
  ngOnDestroy(): void {
    this.releaseBlob();
    this.imgPopup = null;
  }
}
