import { Component, Input, OnInit } from "@angular/core";
import { Role, RolesService, Configs } from "src/app/apis";
import { NotifyService } from "src/app/services/notify.service";
import { isNullOrSpace } from "src/app/utils/util";
import { throwError, iif } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-manageroles",
  templateUrl: "./manageroles.component.html",
  styleUrls: ["./manageroles.component.scss"],
})
export class ManageRolesComponent implements OnInit {
  constructor(
    public rolesApi: RolesService,
    public notifyService: NotifyService
  ) {}

  @Input() public newRoleName = "";

  public roles: Role[] = [];

  public objectKeys = Object.keys;

  public readonly okStr = Configs.UiLangsEnum.Create;

  public reloadRoles = () => {
    this.rolesApi
      .roles()
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) {
            this.roles = [];
            throw apiRes.error;
          }
          this.roles = apiRes.data.data;
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  public create = (data: { role: string }) => {
    let role = data.role;
    if (isNullOrSpace(role)) {
      this.notifyService.toast(Configs.ServiceMessagesEnum.InvalidRoleName);
      return;
    }
    this.rolesApi
      .addRole({ name: role.trim() })
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          this.roles.unshift(apiRes.data);
          this.roles = this.roles.slice(0);
          data.role = "";
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  public deleteRole = (role: Role) => {
    this.rolesApi
      .removeRole(role.id)
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) throw apiRes.error;
          const idx = this.roles.indexOf(role);
          this.roles.splice(idx, 1);
          this.roles = this.roles.slice(0);
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  public switchRolePermission = (role: Role, permission: string, e: any) => {
    if (!permission || !role.permissions) {
      e.source.checked = role.permissions[permission];
      return;
    }
    iif(
      () => role.permissions[permission],
      this.rolesApi.removePermissionFromRole(role.id, permission),
      this.rolesApi.addPermissionToRole(role.id, permission)
    )
      .pipe(
        tap((apiRes) => {
          if (!apiRes.result) {
            e.source.checked = role.permissions[permission];
            throw apiRes.error;
          }
          role.permissions[permission] = !role.permissions[permission];
          e.source.checked = role.permissions[permission];
        })
      )
      .subscribe({ error: (er) => this.notifyService.toast(er) });
  };

  ngOnInit() {
    this.reloadRoles();
  }
}
