import { Directive,Input, ElementRef, HostListener, OnInit, OnDestroy} from '@angular/core';
import {fromEvent, Subscription } from 'rxjs'

@Directive({
  selector: '[appRegisterEvent]'
})
export class RegisterEventDirective implements OnInit, OnDestroy {
  @Input('appRegisterEvent') events: object
  @Input() eventData: any

  constructor(public ref: ElementRef) { }

  public subscriptions: Subscription[] = []
  ngOnInit() {
    if (this.events) {
      for (let [key,fn] of Object.entries(this.events)) {
        if (typeof fn === 'function') {
          const sub = fromEvent(this.ref.nativeElement, key).subscribe((event)=> {
            this.events[key](this.eventData || event)
          })
          this.subscriptions.push(sub)
        }
      }
    }
  }
  ngOnDestroy() {
    if (this.subscriptions.length){
      this.subscriptions.forEach(item => item.unsubscribe())
      this.subscriptions = null
    }

  }

}
