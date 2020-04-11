import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";

interface PopupOption {
  data: any;
  maxWidth: number | string;
  maxHeight: number | string;
  height: string;
  width: string;
  panelClass: string | string[];
}

enum PopupType {
  page = "page",
  dialog = "dialog",
}

@Component({
  selector: "app-popup",
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.scss"],
})
export class PopupComponent implements OnDestroy {
  @Input() type: PopupType = PopupType.dialog;
  @Input() title: string = "";
  @Input() subTitle: string;
  @Input() btnSaveStr: string = "Ok";
  @Input() btnCancelStr: string = "Cancle";
  @Input() showCancel: boolean = true;
  @Input() showSave: boolean = true;
  @Input() canSave: boolean = true;
  @Input() showBtnGroup: boolean = true;
  @Input() customizeBtnGroupRef: TemplateRef<any>;
  @Input() option: PopupOption;

  @Output() canceled: EventEmitter<any> = new EventEmitter();
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() init: EventEmitter<any> = new EventEmitter();
  @Output() opened: EventEmitter<any> = new EventEmitter();

  @ViewChild("popup") popupRef: TemplateRef<any>;

  public dialogRef: MatDialogRef<any>;
  public afterClosedSubscription;
  public afterOpenedSubscription;
  constructor(public dialog: MatDialog) {}

  show = () => {
    this.dialogRef = this.dialog.open(this.popupRef, {
      ...(this.option || {}),
    });
    if (this.type !== PopupType.page || !this.customizeBtnGroupRef) {
      this.afterClosedSubscription = this.dialogRef
        .afterClosed()
        .subscribe((isSave) => {
          if (isSave) {
            this.saved.emit();
          } else {
            this.canceled.emit();
          }
        });
    }
    this.afterOpenedSubscription = this.dialogRef
      .afterOpened()
      .subscribe(() => {
        this.init.emit();
      });
    this.opened.emit();
  };
  close = () => {
    this.dialogRef.close();
  };

  public save = () => {
    if (!this.canSave) return;
    this.dialogRef.close(true);
  };

  ngOnDestroy() {
    this.afterClosedSubscription && this.afterClosedSubscription.unsubscribe();
    this.afterOpenedSubscription && this.afterOpenedSubscription.unsubscribe();
  }
}
