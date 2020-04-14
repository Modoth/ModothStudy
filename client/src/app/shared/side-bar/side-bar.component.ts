import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  constructor(public appService: AppService) {
    this.links = [
      {
        name: 'ImageEditor',
        defaultLink: '/tools/imageeditor',
        icon: 'image',
      },
      {
        name: 'PythonConsole',
        defaultLink: '/tools/python',
        icon: 'code',
      },
    ];
  }

  @Input() drawer: MatDrawer;

  public links: any;
  ngOnInit() {}
}
