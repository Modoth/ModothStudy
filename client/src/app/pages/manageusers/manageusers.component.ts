import { Component } from '@angular/core';
import { Role, RolesService, User, UsersService, Configs } from 'src/app/apis';
import { NotifyService } from 'src/app/services/notify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrSpace } from 'src/app/utils/util'
import { tap } from 'rxjs/operators'
import { throwError, forkJoin } from 'rxjs';
@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.scss']
})
export class ManageUsersComponent {
  public readonly popupOkStr = Configs.UiLangsEnum.Create
  public readonly createFieldsConfig = [
    { label: Configs.UiLangsEnum.UserName, key: 'name' },
    { label: Configs.UiLangsEnum.Password, type: "password", key: "pwd" }
  ]

  constructor(public usersApi: UsersService,
    public rolesApi: RolesService,
    public route: ActivatedRoute,
    public router: Router,
    public notifyService: NotifyService) { }

  public filter = '';

  public totalCount = 0;

  public users: User[];

  public roles: Role[];

  public states = [
    User.StateEnum.Normal,
    User.StateEnum.Disabled,
  ];

  public updateRole = (user: User, roleId: string) => {
    this.usersApi.changeUserRole(user.id, roleId).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
        user.roleId = roleId
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
  }

  public createUserDialog = (data: { name, pwd }) => {
    if (isNullOrSpace(data.name) || isNullOrSpace(data.pwd)) {
      this.notifyService.toast(Configs.ServiceMessagesEnum.InvalidRoleName);
      return;
    }
    this.usersApi.addUser({ name: data.name, pwd: data.pwd }).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
        this.users.unshift(apiRes.data);
        this.users = this.users.slice(0);
        data.name = ''
        data.pwd = ''
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
  }

  public updateState = (user: User, state: User.StateEnum) => {
    this.usersApi.changeUserState(user.id, state === User.StateEnum.Normal).pipe(
      tap(apiRes => {
        if (!apiRes.result) throw apiRes.error;
        user.state = state;
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
  }

  public search = (data: { filter }) => {
    if (isNullOrSpace(data.filter) && isNullOrSpace(this.filter)) return
    this.router.navigateByUrl(`/manage/users/${data.filter.trim() || " "}/0`);
  }

  public reloadUsers = async ({ filter, pageId, pageSize }) => {
    forkJoin(
      this.usersApi.users(this.filter, +pageId * pageSize, pageSize),
      this.rolesApi.roles()
    ).pipe(
      tap(([userRes, rolesRes]) => {
        if (!userRes.result) throw userRes.error;
        this.users = userRes.data.data;
        this.totalCount = userRes.data.total;
        this.filter = filter.trim();
        if (!rolesRes.result) {
          this.roles = []
          throw rolesRes.error;
        }
        this.roles = rolesRes.data.data
      })
    ).subscribe({ error: er => this.notifyService.toast(er) })
  }
}
