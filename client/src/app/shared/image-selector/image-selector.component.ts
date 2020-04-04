import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {

  @Output() completed: EventEmitter<any> = new EventEmitter()

  public editingImage: File

  constructor() { }

  ngOnInit() {
  }
  public editedImage = (blob: Blob) => {
    this.editingImage = null;
    if(blob){
      this.completed.emit(blob)
    }
  }

}
