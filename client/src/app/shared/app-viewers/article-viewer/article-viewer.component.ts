import { Component, OnInit, Input } from '@angular/core';

// export class ArticleViewerPipe {

//   public values = new Map<string, any>();

//   public promises = new Map<string, (value: any) => any>();

//   async read<T>(key: string): Promise<T> {
//     if (this.values.has(key)) {
//       const value = this.values.get(key);
//       this.values.delete(key);
//       return value as T;
//     }
//     const promise = new Promise<any>(resolve => {
//       this.promises.set(key, resolve);
//     });
//     return promise;
//   }

//   write<T>(key: string, value: T) {
//     this.values.set(key, value);
//     if (this.promises.has(key)) {
//       const resolve = this.promises.get(key);
//       this.promises.delete(key);
//       resolve(value);
//     }
//   }
// }

@Component({
  selector: 'app-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss']
})
export class ArticleViewerComponent implements OnInit {

  @Input() type: string;

  @Input() options: any;

  @Input() content: string;

  constructor() { }

  ngOnInit() {
  }

}
