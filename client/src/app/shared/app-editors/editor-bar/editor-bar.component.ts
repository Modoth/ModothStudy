import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-editor-bar',
  templateUrl: './editor-bar.component.html',
  styleUrls: ['./editor-bar.component.scss']
})
export class EditorBarComponent {
  @Input() isFullScreen: boolean = false;
  @Input() showLive: boolean = true;
  @Input() operators: any;
  private _livePreview: boolean;
  @Input() set livePreview(value: boolean) {
    if (this._livePreview == value) {
      return;
    }
    this._livePreview = value;
    this.livePreviewChanged.emit(this._livePreview);
  }
  get livePreview() {
    return this._livePreview;
  }
  @Output() livePreviewChanged: EventEmitter<any> = new EventEmitter()
  @Input() status: string = "primary" //'warn'

  @Input() options: any = {
    symbolInputs: [],
    symbolInsert: new EventEmitter()
  };

  @Output() saved: EventEmitter<string> = new EventEmitter();

  @Output() closed: EventEmitter<any> = new EventEmitter();

  @Output() formatted: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }
  // ngOnChanges(_: SimpleChanges) {
  //   if (_.defalutLivePreview && _.defalutLivePreview.currentValue !== _.defalutLivePreview.previousValue) {
  //     this.livePreview = _.defalutLivePreview.currentValue
  //   }
  // }
}
