import {Injectable} from '@angular/core';
import {GlobalService} from '../global.service';
import {HttpClient} from '@angular/common/http';
import {ResponseBuilderModel} from '../../models/ResponseBuilder.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class UserOutletInfoService {
  apiConfig;

  constructor (private svcGlobal: GlobalService, private httpClient: HttpClient) {
    this.apiConfig = this.svcGlobal.getSession('API_CONFIG');
  }

  getAllOutlets () {
    return this.httpClient.get<ResponseBuilderModel>(this.apiConfig.API_PROTOCOL + '://' +
      this.apiConfig.API_IP
      + ':' + this.apiConfig.API_PORT + '/'
      + this.apiConfig.API_PATH + '/userOutletInfo/userProfile');
  }

}
