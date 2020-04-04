import { OnChanges, SimpleChanges, EventEmitter, Input, Output, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { MdReloadService } from 'src/app/services/md-reload.service';

export class EditorBase implements OnChanges {

    @Input() defalutContent: string;

    @Input() type: string;

    @Output() changed: EventEmitter<string> = new EventEmitter();

    @Output() saved: EventEmitter<string> = new EventEmitter();

    @Output() closed: EventEmitter<any> = new EventEmitter();

    constructor(public mdReload: MdReloadService, public cdRef: ChangeDetectorRef) { }

    public hasChanged = false;
    @Input() public livePreview: boolean = true;
    public editor: any;
    public langsOptions: any;

    public operators = [
        {
            icon: "format_align_left", exec: () => {
                if (!this.editor || !this.changedContent) {
                    return;
                }
                this.editor.trigger('', 'editor.action.formatDocument');
                this.hasChanged = true
            }
        }
    ]

    public mChangeContent: string = null;
    get changedContent() {
        return this.mChangeContent;
    }

    set changedContent(value) {
        this.mChangeContent = value;
        if (this.livePreview) {
            this.changed.emit(value);
        }
    }

    needLayoutEditor = false;
    relayoutEditor = () => {
        if (!this.editor || !this.needLayoutEditor) {
            return;
        }
        this.needLayoutEditor = false;
        setTimeout(() => {
            this.editor.layout();
        }, 50);
    }

    ngOnChanges(_: SimpleChanges): void {
        if (_.defalutContent && _.defalutContent.currentValue !== _.defalutContent.previousValue) {
            this.changedContent = _.defalutContent.currentValue;
        }
        if ("defalutContent" in _) {
            this.needLayoutEditor = true;
            this.relayoutEditor();
        }
    }

    livePreviewChanged = (isLive) => {
        this.livePreview = isLive
        // if (this.livePreview) {
        //     this.changed.emit(this.mChangeContent);
        // }
    }

    saveContent = () => {
        if (this.hasChanged) {
            this.defalutContent = this.changedContent;
            this.saved.emit(this.changedContent);
            this.hasChanged = false;
        }
    }

    close() {
        this.closed.emit();
    }

    public bindingEditorEvents(ele: HTMLElement) {
        if (!ele) {
            return;
        }
        ele.addEventListener('keydown', this.editorOnKeyDown, { capture: true });
    }
    public editorOnKeyDown = (event: KeyboardEvent) => {
        if (!event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
            return;
        }
        switch (event.key) {
            case 's':
                event.preventDefault();
                event.stopPropagation();
                this.saveContent();
                this.cdRef.detectChanges();
                break;
        }
    }
    public updateEditor(): void {
        this.hasChanged = false;
        this.mdReload.reload();
    }

    insertText = (iptValue: string) => {
        if (!this.editor) {
            return;
        }
        const line = this.editor.getPosition();
        const range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
        const id = { major: 1, minor: 1 };
        const op = { identifier: id, range, text: iptValue, forceMoveMarkers: true };
        this.editor.executeEdits('', [op]);
    }

    initEditor(editor) {
        var w: any = window;
        w.editor = editor;
        this.editor = editor;
        const editorDom = this.editor.getDomNode();
        this.bindingEditorEvents(editorDom);
        if (!this.langsOptions) {
            this.langsOptions = {
                format: Object.create(monaco.languages.html.htmlDefaults.options.format),
                suggest: Object.create(monaco.languages.html.htmlDefaults.options.suggest)
            };
            this.langsOptions.format.tabSize = 2;
            this.langsOptions.format.insertSpaces = true;
            monaco.languages.html.htmlDefaults.setOptions(this.langsOptions);
        }

        this.editor.onDidChangeModelContent((_) => {
            if (!this.hasChanged && this.defalutContent !== this.changedContent) {
                this.hasChanged = true;
            }
        });
        // setTimeout(() => {
        //     this.editor.layout();
        // }, 50);
        this.relayoutEditor();
    }

}