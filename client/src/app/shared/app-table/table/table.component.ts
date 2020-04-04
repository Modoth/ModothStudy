import { Component,Input, EventEmitter} from '@angular/core';

interface Pagination {
  pageSize: number
  total: number,
  routeLink: string
  pageChanged: EventEmitter<any>
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() dataSource: []
  @Input() columns: string[]
  @Input() colTemplateRef: object = {}
  @Input() colOptions: object = {}
  @Input() colHeaders: object = {}
  @Input() headerTemplateRef: object = {}
  @Input() isRoutePaging: boolean = false
  @Input() pagination: Pagination

  constructor() { }

  getDefalutHeader(col: string): string {
    return col.substring(0,1).toUpperCase() + col.substring(1)
  }
  
}
