import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { CommentService } from './api/comment.service';
import { ConfigsService } from './api/configs.service';
import { FilesService } from './api/files.service';
import { LoginService } from './api/login.service';
import { NodesService } from './api/nodes.service';
import { RolesService } from './api/roles.service';
import { TagsService } from './api/tags.service';
import { UsersService } from './api/users.service';
import { WxService } from './api/wx.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    CommentService,
    ConfigsService,
    FilesService,
    LoginService,
    NodesService,
    RolesService,
    TagsService,
    UsersService,
    WxService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
