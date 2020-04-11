import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { Configs } from "src/app/apis";
import { PopupComponent } from "src/app/shared/popup/popup.component";
import { FormBuilderComponent } from "src/app/shared/form-builder/form-builder.component";

@Component({
  selector: "app-searcher",
  templateUrl: "./searcher.component.html",
  styleUrls: ["./searcher.component.scss"],
})
export class SearcherComponent implements OnDestroy {
  @Input() defaultFilter: string;
  @Output() search: EventEmitter<any> = new EventEmitter();

  public readonly okStr = Configs.UiLangsEnum.Search;

  @ViewChild("searchForm") public searchForm: FormBuilderComponent;
  @ViewChild("searchPopup") public searchPopup: PopupComponent;
  constructor() {}

  onEnter = (event: KeyboardEvent) => {
    if (!event || event.key === "Enter") {
      this.search.emit(this.searchForm.getData());
      this.searchPopup.close();
    }
  };
  ngOnDestroy() {
    this.searchPopup = null;
    this.searchForm = null;
  }
}
