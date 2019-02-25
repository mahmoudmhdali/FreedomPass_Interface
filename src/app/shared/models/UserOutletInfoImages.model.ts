import {UserOutletInfoModel} from './UserOutletInfo.model';

export class UserOutletInfoImagesModel {
  public id: number;
  public imageIndex: number;
  public path: string;
  public userOutletInfo: UserOutletInfoModel;

  constructor(id: number, imageIndex: number, path: string, userOutletInfo: UserOutletInfoModel) {
    this.id = id;
    this.imageIndex = imageIndex;
    this.path = path;
    this.userOutletInfo = userOutletInfo;
  }
}
