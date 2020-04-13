import { Component, OnInit, ElementRef } from "@angular/core";

@Component({
  selector: "app-play-python",
  templateUrl: "./play-python.component.html",
  styleUrls: ["./play-python.component.scss"],
})
export class PlayPythonComponent implements OnInit {
  initCommends = `print("hello!")`;

  constructor(public hostRef: ElementRef<HTMLElement>) {}

  ngOnInit() {}

  onFocusChanged(focus) {
    if (focus) {
      this.hostRef.nativeElement.scrollTo({
        top: this.hostRef.nativeElement.scrollHeight,
      });
      console.log(
        `${this.hostRef.nativeElement.scrollHeight} ${this.hostRef.nativeElement.scrollTop}`
      );
    }
  }
}
