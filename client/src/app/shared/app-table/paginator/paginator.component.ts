import { Component, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges, OnInit, OnDestroy {
  @Input() routeLink: string
  @Input() totalCount: number = 0
  @Input() pageSize: number = 10
  @Output() pageChanged: EventEmitter<any> = new EventEmitter()

  public currentPage: number = 0
  public totalPage: number
  public routeParams = {}
  public routerSubscription
  public readonly reg = /\/:(\w*)/g
  
  constructor(public router: ActivatedRoute) { }

  public getLink(pageId: number): string {
    if (!this.routeLink) return ""
    return this.routeLink.replace(this.reg, (match, key) => {
      let value = this.routeParams[key]
        if (key === 'pageId') {
          value = pageId
        }
        return `/${value}`
    })
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.totalCount.currentValue !== changes.totalCount.previousValue) {
      this.totalPage = Math.ceil(this.totalCount / this.pageSize)
    }
  }
  ngOnInit() {
    this.routerSubscription = this.router.params.subscribe(p => {
      this.currentPage = +p['pageId']
      this.routeParams = p || {},
      this.pageChanged.emit({...p, pageSize: this.pageSize})
    })
  }
  ngOnDestroy() {
    this.routerSubscription && this.routerSubscription.unsubscribe()
  }
}
