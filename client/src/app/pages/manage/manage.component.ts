import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { LoginUser } from 'src/app/apis';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public links = ['users', 'roles', 'tags', 'configs']

  public linksName = { 'users': 'User', 'roles': 'Role', 'tags': 'Tags', 'configs': "Configs" }

  public linksUrl = { 'users': 'users/ /0', 'roles': 'roles', 'tags': 'tags/ /0', 'configs': 'configs/ /0' }

  public loginUser: LoginUser;

  public subscriptions: Subscription[] = [];

  constructor(public appService: AppService, public router: Router, public location: Location) {
    this.subscriptions.push(this.appService.loginUsers.subscribe(this.onLoginUserChanged));
  }

  onLoginUserChanged = (user) => {
    this.loginUser = user;
  }


  ngOnInit() {
    const tokens = this.location.path(false).split('/');
  }
}
