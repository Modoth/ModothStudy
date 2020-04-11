import { HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MarkdownModule } from "ngx-markdown";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApiModule } from "./apis";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EditorComponent } from "./pages/editor/editor.component";
import { ExplorerComponent } from "./pages/explorer/explorer.component";
import { LibraryComponent } from "./pages/library/library/library.component";
import { LoginComponent } from "./pages/login/login.component";
import { ManageComponent } from "./pages/manage/manage.component";
import { ManageRolesComponent } from "./pages/manageroles/manageroles.component";
import { ManageUsersComponent } from "./pages/manageusers/manageusers.component";
import { AppService } from "./services/app.service";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { MatIconModule } from "@angular/material/icon";
import {
  MatDialogModule,
  MatButtonToggleModule,
  MatCardModule,
  MatListModule,
  MatRadioModule,
} from "@angular/material";
import { MdReloadService } from "./services/md-reload.service";
import { LangPipe } from "./pipes/lang.pipe";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { ManageTagsComponent } from "./pages/manage-tags/manage-tags.component";
import { ManageConfigsComponent } from "./pages/manage-configs/manage-configs.component";
import { NodeTagViewComponent } from "./shared/app-viewers/node-tag-view/node-tag-view.component";
import { NodeTagEditorComponent } from "./shared/app-editors/node-tag-editor/node-tag-editor.component";
import { QueryComponent } from "./pages/query/query.component";
import { OverlayModule } from "@angular/cdk/overlay";
import { ImageEditorComponent } from "./shared/app-editors/image-editor/image-editor.component";
import { PlayImageEditorComponent } from "./pages/play-image-editor/play-image-editor.component";
import { ImageViewerComponent } from "./shared/app-viewers/image-viewer/image-viewer.component";
import { ToolsComponent } from "./pages/tools/tools.component";
import { CommentsViewerComponent } from "./pages/comments-viewer/comments-viewer.component";
import { PlayPythonComponent } from "./pages/play-python/play-python.component";
import { ArticleViewerComponent } from "./shared/app-viewers/article-viewer/article-viewer.component";
import { MarkdownViewerComponent } from "./shared/app-viewers/markdown-viewer/markdown-viewer.component";
import { HtmlViewerComponent } from "./shared/app-viewers/html-viewer/html-viewer.component";
import { PythonViewerComponent } from "./shared/app-viewers/python-viewer/python-viewer.component";
import { ArticleEditorComponent } from "./shared/app-editors/article-editor/article-editor.component";
import { PythonTerminalComponent } from "./shared/python-terminal/python-terminal.component";
import { FriendlyDatePipe } from "./pipes/friendly-date.pipe";
import { TerminalImeComponent } from "./shared/terminal-ime/terminal-ime.component";
import { HistoryComponent } from "./pages/login/history/history.component";
import { TableComponent } from "./shared/app-table/table/table.component";
import { RegisterEventDirective } from "./shared/app-table/register-event/register-event.directive";
import { PaginatorComponent } from "./shared/app-table/paginator/paginator.component";
import { EditorBarComponent } from "./shared/app-editors/editor-bar/editor-bar.component";
import { MarkdownEditorComponent } from "./shared/app-editors/markdown-editor/markdown-editor.component";
import { PythonEditorComponent } from "./shared/app-editors/python-editor/python-editor.component";
import { HtmlEditorComponent } from "./shared/app-editors/html-editor/html-editor.component";
import { PopupComponent } from "./shared/popup/popup.component";
import { FormBuilderComponent } from "./shared/form-builder/form-builder.component";
import { ImageSelectorComponent } from "./shared/image-selector/image-selector.component";
import { SearcherComponent } from "./shared/searcher/searcher.component";
import { NodeItemComponent } from "./pages/library/node-item/node-item.component";
import { NodeListComponent } from "./pages/library/node-list/node-list.component";
import { NodeDetailComponent } from "./pages/library/node-detail/node-detail.component";
import { NodeHeaderComponent } from "./pages/library/node-header/node-header.component";
import { JsonEditorComponent } from "./shared/app-editors/json-editor/json-editor.component";
import { ToggleButtonGroupComponent } from "./shared/toggle-button-group/toggle-button-group.component";
import { BASE_PATH } from "./apis/variables";
import { SelectNodeComponent } from "./shared/select-node/select-node.component";
import { JsonViewerComponent } from "./shared/app-viewers/json-viewer/json-viewer.component";
@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ExplorerComponent,
    LibraryComponent,
    LoginComponent,
    ManageComponent,
    NavbarComponent,
    ManageUsersComponent,
    ManageRolesComponent,
    LangPipe,
    ManageTagsComponent,
    ManageConfigsComponent,
    NodeTagViewComponent,
    NodeTagEditorComponent,
    QueryComponent,
    ImageEditorComponent,
    PlayImageEditorComponent,
    ImageViewerComponent,
    ToolsComponent,
    CommentsViewerComponent,
    PlayPythonComponent,
    ArticleViewerComponent,
    MarkdownViewerComponent,
    HtmlViewerComponent,
    PythonViewerComponent,
    ArticleEditorComponent,
    PythonTerminalComponent,
    FriendlyDatePipe,
    TerminalImeComponent,
    HistoryComponent,
    TableComponent,
    RegisterEventDirective,
    PaginatorComponent,
    EditorBarComponent,
    MarkdownEditorComponent,
    PythonEditorComponent,
    HtmlEditorComponent,
    PopupComponent,
    FormBuilderComponent,
    ImageSelectorComponent,
    SearcherComponent,
    NodeItemComponent,
    NodeListComponent,
    NodeDetailComponent,
    NodeHeaderComponent,
    JsonEditorComponent,
    ToggleButtonGroupComponent,
    SelectNodeComponent,
    JsonViewerComponent,
  ],
  imports: [
    OverlayModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatRadioModule,
    MonacoEditorModule.forRoot(),
    ApiModule,
  ],
  providers: [
    AppService,
    MdReloadService,
    { provide: LOCALE_ID, useValue: "zh-CN" },
    { provide: BASE_PATH, useValue: " " },
  ],
  entryComponents: [QueryComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
