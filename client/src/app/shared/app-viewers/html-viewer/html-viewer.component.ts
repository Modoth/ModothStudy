import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild, ElementRef, AfterViewChecked, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IPythonService, IframePythonService } from '../../python-service/python-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-html-viewer',
  templateUrl: './html-viewer.component.html',
  styleUrls: ['./html-viewer.component.scss']
})
export class HtmlViewerComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() content: string;

  @Input() options: any;

  @ViewChild('iframeRef') iframeRef: ElementRef<HTMLIFrameElement>;

  play = false;

  showMenus = false;

  showBorder = true;

  contentUrl: any;

  @Input() fullscreen = false;

  nonScriptContentUrl: any;

  popContentUrl: string = null;

  @Output() popContentUrlChange = new EventEmitter<string>();

  mdSource: string = null;

  showSource = false;

  showTerminal = false;

  public window: any;

  public canPlay = true;

  public resolveWhenIframeLoaded;

  public pythonService: IframePythonService;

  getApp: () => Observable<string>;

  constructor(public sanitizer: DomSanitizer) {
    this.window = window;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes && this.options) {
      if (!changes['options'].firstChange) {
        return;
      }
      if (this.options.play) {
        this.play = this.options.play.value;
      }
      if (this.options.showMenus) {
        this.showMenus = this.options.showMenus.value;
      }
      if (this.options.showBorder) {
        this.showBorder = this.options.showBorder.value;
      }
      if (this.options.pythonService) {
        this.pythonService = this.options.pythonService.value;
      }
      if (this.options.getApp) {
        this.getApp = this.options.getApp.value;
      }
    }
    if ('content' in changes) {
      if (this.getApp && !this.content) {
        this.getApp().subscribe(content => {
          if (!content) {
            return;
          }
          this.content = content;
          this.parseContent();
        });
      }
      this.parseContent();
    }
  }

  openContentUrl() {
    window.open(this.popContentUrl, '_blank');
  }

  parseContent() {
    let content = this.content || '';
    const dataUrl = 'data:text/html,' + encodeURIComponent(this.pythonService ?
      this.pythonService.getContent(content) : content);
    if (this.pythonService) {
      this.pythonService.getHost = this.getPythonServiceHost;
    }
    this.popContentUrl = this.window.chrome ? null : dataUrl;
    this.popContentUrlChange.emit(this.popContentUrl);
    this.contentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
    let noScriptContent = this.removeScript(content);
    this.canPlay = content.length > 0 && noScriptContent.length < content.length;
    this.nonScriptContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/html,' +
      encodeURIComponent(noScriptContent));
    this.mdSource = '```html\n' + this.content + '\n```';
  }

  getPythonServiceHost = async (): Promise<HTMLIFrameElement> => {
    if (this.iframeRef && this.iframeRef.nativeElement) {
      return this.iframeRef.nativeElement;
    }
    const promise = new Promise<HTMLIFrameElement>(resolve => this.resolveWhenIframeLoaded = resolve);
    setTimeout(() => this.play = true, 0);
    return promise;
  }

  ngAfterViewChecked() {
    if (this.iframeRef && this.iframeRef.nativeElement && this.resolveWhenIframeLoaded) {
      const resolve = this.resolveWhenIframeLoaded;
      this.resolveWhenIframeLoaded = null;
      resolve(this.iframeRef.nativeElement);
    }
  }

  removeScript(html) {
    return html && html.replace(/<script(.|[\r\n])*?<\/script\s?>/img, '');
  }
}
