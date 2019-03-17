import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalService} from '../global.service';
import {TokensService} from './tokens.service';
import {NgxPermissionsService} from 'ngx-permissions';
import {UserProfileModel} from '../../models/UserProfile.model';
import {LogsService} from '../logs.service';

@Injectable()
export class AuthService {
  apiConfig;
  responseCodeConfig;
  tokensConfig;

  constructor(private router: Router,
              private httpClient: HttpClient,
              private ngxPermissionsService: NgxPermissionsService,
              private svcGlobal: GlobalService,
              private logsService: LogsService,
              private tokensService: TokensService) {
    this.apiConfig = this.svcGlobal.getSession('API_CONFIG');
    this.responseCodeConfig = this.svcGlobal.getSession('RESPONSE_CODE');
    this.tokensConfig = this.svcGlobal.getSession('TOKENS_CONFIG');
  }

  signUpUser(email: string, password: string) {
  }

  signInUser(email: string, password: string, rememberMe: boolean) {
    const userCredentials = {'email': email, 'password': password, 'rememberMe': rememberMe};
    return this.httpClient.post(this.apiConfig.API_PROTOCOL + '://' +
      this.apiConfig.API_IP
      + ':' + this.apiConfig.API_PORT + '/'
      + this.apiConfig.API_PATH + '/login', JSON.stringify(userCredentials));
  }

  signOut() {
    this.tokensService.clearTokens();
    this.router.navigate(['/sessions/signin']);
  }

  isAuthenticated() {
    return this.tokensService.isTokentExpired();
  }

  loadPermissionsBasedOnLoggedInUser(userProfile: UserProfileModel) {
    const permissions = [];
    for (const group of userProfile.groupCollection) {
      for (const role of group.roleCollection) {
        if (!permissions.includes(role.role)) {
          permissions.push(role.role);
        }
      }
    }
    this.logsService.setLog('AuthService', 'loadPermissionsBasedOnLoggedInUser', userProfile);
    this.ngxPermissionsService.loadPermissions(permissions, (permissionName, permissionStore) => {
      return !!permissionStore[permissionName];
    });
  }

  navigationBasedOnRoles() {

    if (typeof this.ngxPermissionsService.getPermission('OUTLET') !== 'undefined') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/users']);
    }
    this.logsService.setLog('AuthService', 'navigationBasedOnRoles', this.ngxPermissionsService.getPermissions());
    // if (typeof this.ngxPermissionsService.getPermission('VIEW_DASHBOARD') !== 'undefined') {
    //   this.router.navigate(['/dashboard']);
    // } else if (typeof this.ngxPermissionsService.getPermission('INSTALLER') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('VIEW_REPORTS') !== 'undefined') {
    //   this.router.navigate(['/report']);
    // } else if (typeof this.ngxPermissionsService.getPermission('VIEW_SETTINGS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('ADD_SETTINGS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('EDIT_SETTINGS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('DELETE_SETTINGS') !== 'undefined') {
    //   this.router.navigate(['/settings']);
    // } else if (typeof this.ngxPermissionsService.getPermission('VIEW_USERS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('ADD_USERS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('EDIT_USERS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('DELETE_USERS') !== 'undefined') {
    //   this.router.navigate(['/users']);
    // } else if (typeof this.ngxPermissionsService.getPermission('VIEW_GROUPS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('ADD_GROUPS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('EDIT_GROUPS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('DELETE_GROUPS') !== 'undefined') {
    //   this.router.navigate(['/groups']);
    // } else if (typeof this.ngxPermissionsService.getPermission('VIEW_BLACKLISTS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('ADD_BLACKLISTS') !== 'undefined' ||
    //   typeof this.ngxPermissionsService.getPermission('DELETE_BLACKLISTS') !== 'undefined') {
    //   this.router.navigate(['/blacklists']);
    // } else {
    //   this.router.navigate(['/sessions/signin']);
    // }

  }

}
