import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
})
export class HistoryComponent {
  @Input() histories;
  @Output() clear = new EventEmitter();
  constructor() {}
}
