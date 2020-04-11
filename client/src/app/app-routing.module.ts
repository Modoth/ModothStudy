import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ExplorerComponent } from "./pages/explorer/explorer.component";
import { LibraryComponent } from "./pages/library/library/library.component";
import { NodeListComponent } from "./pages/library/node-list/node-list.component";
import { NodeDetailComponent } from "./pages/library/node-detail/node-detail.component";
import { LoginComponent } from "./pages/login/login.component";
import { EditorComponent } from "./pages/editor/editor.component";
import { ManageComponent } from "./pages/manage/manage.component";
import { ManageUsersComponent } from "./pages/manageusers/manageusers.component";
import { ManageRolesComponent } from "./pages/manageroles/manageroles.component";
import { ManageTagsComponent } from "./pages/manage-tags/manage-tags.component";
import { ManageConfigsComponent } from "./pages/manage-configs/manage-configs.component";
import { PlayImageEditorComponent } from "./pages/play-image-editor/play-image-editor.component";
import { ToolsComponent } from "./pages/tools/tools.component";
import { PlayPythonComponent } from "./pages/play-python/play-python.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "explorer" },
  {
    path: "explorer",
    pathMatch: "full",
    component: ExplorerComponent,
    data: {},
  },
  {
    path: "library",
    component: LibraryComponent,
    data: {},
    children: [
      { path: "", pathMatch: "full", redirectTo: "list/0/ /0" },
      {
        path: "list/:nodeId/:filter/:pageId",
        component: NodeListComponent,
        data: {},
      },
      {
        path: "detail/:nodeId",
        component: NodeDetailComponent,
        data: {},
      },
      {
        path: "view/:nodeId",
        pathMatch: "full",
        component: EditorComponent,
        data: {},
      },
    ],
  },
  {
    path: "tools",
    component: ToolsComponent,
    pathMatch: "prefix",
    data: {},
    children: [
      { path: "", pathMatch: "full", redirectTo: "python" },
      {
        path: "imageeditor",
        component: PlayImageEditorComponent,
        pathMatch: "full",
        data: {},
      },
      {
        path: "python",
        component: PlayPythonComponent,
        pathMatch: "full",
        data: {},
      },
    ],
  },
  {
    path: "manage",
    pathMatch: "prefix",
    component: ManageComponent,
    data: {},
    children: [
      { path: "", pathMatch: "full", redirectTo: "users/ /0" },
      {
        path: "users/:filter/:pageId",
        pathMatch: "full",
        component: ManageUsersComponent,
        data: {},
      },
      {
        path: "roles",
        pathMatch: "full",
        component: ManageRolesComponent,
        data: {},
      },
      {
        path: "tags/:filter/:pageId",
        pathMatch: "full",
        component: ManageTagsComponent,
        data: {},
      },
      {
        path: "configs/:filter/:pageId",
        pathMatch: "full",
        component: ManageConfigsComponent,
        data: {},
      },
    ],
  },
  { path: "login", pathMatch: "full", component: LoginComponent, data: {} },
  {
    path: "editor/:nodeId",
    pathMatch: "full",
    component: EditorComponent,
    data: {},
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
