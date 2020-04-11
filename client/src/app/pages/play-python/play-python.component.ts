import { Component, OnInit, ElementRef } from "@angular/core";

@Component({
  selector: "app-play-python",
  templateUrl: "./play-python.component.html",
  styleUrls: ["./play-python.component.scss"],
})
export class PlayPythonComponent implements OnInit {
  initCommends = `async def f():
    print("sleep")
    await sleep(2000)
    print("123 sleep")
    await sleep(2000)
    print("123 sleep")
    await sleep(2000)
    print("123 sleep")
    await 123
    print("awake")

print("enjoy")
f()`;

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
