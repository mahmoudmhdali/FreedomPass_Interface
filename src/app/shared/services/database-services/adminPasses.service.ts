import {Injectable} from '@angular/core';
import {GlobalService} from '../global.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseBuilderModel} from '../../models/ResponseBuilder.model';

@Injectable()
export class AdminPassesService {
  apiConfig;

  constructor (private svcGlobal: GlobalService, private httpClient: HttpClient) {
    this.apiConfig = this.svcGlobal.getSession('API_CONFIG');
  }

  getAllPasses () {
    return this.httpClient.get<ResponseBuilderModel>(this.apiConfig.API_PROTOCOL + '://' +
      this.apiConfig.API_IP
      + ':' + this.apiConfig.API_PORT + '/'
      + this.apiConfig.API_PATH + '/adminPasses/packages');
  }

  getAllPassesPagingPackages (pageNumber, maxResult) {
    return this.httpClient.get<ResponseBuilderModel>(this.apiConfig.API_PROTOCOL + '://' +
      this.apiConfig.API_IP
      + ':' + this.apiConfig.API_PORT + '/'
      + this.apiConfig.API_PATH + '/adminPasses/packages/' + pageNumber + '/' + maxResult);
  }

  getAllPassesPagingPackagesSubsc (pageNumber, maxResult) {
    return this.httpClient.get<ResponseBuilderModel>(this.apiConfig.API_PROTOCOL + '://' +
      this.apiConfig.API_IP
      + ':' + this.apiConfig.API_PORT + '/'
      + this.apiConfig.API_PATH + '/adminPasses/subscriptions/' + pageNumber + '/' + maxResult);
  }

  addPass (formData) {
    const headers = new HttpHeaders({'Accept': 'application/json'});
    return this.httpClient.post(this.apiConfig.API_PROTOCOL + '://' +
      this.apiConfig.API_IP
      + ':' + this.apiConfig.API_PORT + '/'
      + this.apiConfig.API_PATH + '/adminPasses/add', formData, {headers});

  }

  editPass (formData) {
    const headers = new HttpHeaders({'Accept': 'application/json'});
    return this.httpClient.post(this.apiConfig.API_PROTOCOL + '://' +
      this.apiConfig.API_IP
      + ':' + this.apiConfig.API_PORT + '/'
      + this.apiConfig.API_PATH + '/adminPasses/edit', formData, {headers});

  }

  removePackage (packageID) {
    const headers = new HttpHeaders({'Accept': 'application/json'});
    // if we need the full response we should add {headers, observe: 'response'}
    return this.httpClient.post(this.apiConfig.API_PROTOCOL + '://' +
      this.apiConfig.API_IP
      + ':' + this.apiConfig.API_PORT + '/'
      + this.apiConfig.API_PATH + '/adminPasses/delete/' + packageID, null, {headers});
  }

}
