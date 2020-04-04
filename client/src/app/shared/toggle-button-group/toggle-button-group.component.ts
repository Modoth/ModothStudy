import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-toggle-button-group',
  templateUrl: './toggle-button-group.component.html',
  styleUrls: ['./toggle-button-group.component.scss']
})
export class ToggleButtonGroupComponent implements OnInit {
  @Input() icoRef: TemplateRef<any>
  constructor() { }
  public mHiddenOps = true;
  
  public get hiddenOps() {
    return this.mHiddenOps;
  }
  public set hiddenOps(value) {
    if (this.mHiddenOps === value) {
      return;
    }
    this.mHiddenOps = value;
    if (!value) {
      document.addEventListener('touchstart', this.hideOpsWhenClick);
    } else {
      document.removeEventListener('touchstart', this.hideOpsWhenClick);
    }
  }
  public hideOpsWhenClick = () => {
    setTimeout(() => this.hiddenOps = true, 200);
  }

  ngOnInit() {
  }

}
