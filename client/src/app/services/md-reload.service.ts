import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MdReloadService {
  public MathJax: any;

  constructor() {
    var w: any = window;
    this.MathJax = w.MathJax;
  }

  public reload() {
    setTimeout(() => {
      this.MathJax && this.MathJax.Hub.Queue(["Typeset", this.MathJax.Hub]);
    }, 0);
  }
}
