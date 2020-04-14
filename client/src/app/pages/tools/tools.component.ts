import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tools",
  templateUrl: "./tools.component.html",
  styleUrls: ["./tools.component.scss"],
})
export class ToolsComponent implements OnInit {
  public links = [
    {
      name: "PythonConsole",
      url: "python",
    },
    {
      name: "ImageEditor",
      url: "imageeditor",
    },
  ];

  public activeLink: any;

  constructor() {}

  ngOnInit() {}
}
