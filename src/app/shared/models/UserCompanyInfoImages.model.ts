import {UserCompanyInfoModel} from './UserCompanyInfo.model';

export class UserCompanyInfoImagesModel {
  public id: number;
  public imageIndex: number;
  public path: string;
  public userCompanyInfo: UserCompanyInfoModel;

  constructor(id: number, imageIndex: number, path: string, userCompanyInfo: UserCompanyInfoModel) {
    this.id = id;
    this.imageIndex = imageIndex;
    this.path = path;
    this.userCompanyInfo = userCompanyInfo;
  }
}
