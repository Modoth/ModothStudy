import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  public links = [{
    name: 'ImageEditor',
    url: "imageeditor"
  }, {
    name: 'Python',
    url: "python"
  }]

  public activeLink: any;

  constructor() { }


  ngOnInit() {
  }

}
