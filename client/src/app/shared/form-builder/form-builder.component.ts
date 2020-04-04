import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

interface Field {
  label: string
  type: string
  key: string,
  events: {}
}

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})

export class FormBuilderComponent implements OnInit, OnChanges {

  @Input() fields: Field[] = []
  @Input() data: {}
  @Input() refs: {} = {}


  public formData: {} = {}

  constructor() { }

  ngOnInit() {
    if (!this.data && this.fields.length) {
      this.formData = this.fields.reduce((obj, item) => {
         obj[item.key] = ''
         return obj
      }, {})
      return
    }
    this.formData = {...this.data}
    }

  getData() {
    return this.formData
  }

  reSetData() {
    for (let key in this.formData){
      this.formData[key] = this.data ? this.data[key] : ''
    }
  }

  clearData() {
    for (let key in this.formData){
      this.formData[key] = ''
    }
  }

  ngOnChanges(_:SimpleChanges) {
    if(_.data && _.data.currentValue !== _.data.previousValue) {
      this.formData = {...(_.data.currentValue || {})}
    }
  }

}
