import {UserCompanyInfoModel} from './UserCompanyInfo.model';
import {AdminPassesModel} from './AdminPasses.model';
import {UserPassPurchasedModel} from './UserPassPurchased.model';

export class UserCompanyPassesModel {
  public id: number;
  public numberOfUsers: number;
  public remainingUsers: number;
  public userCompanyInfo: UserCompanyInfoModel;
  public adminPasses: AdminPassesModel;
  public createdDate: Date;
  public updatedDate: Date;
  public deletedDate: Date;

  constructor(id: number, numberOfUsers: number, remainingUsers: number, userCompanyInfo: UserCompanyInfoModel,
              adminPasses: AdminPassesModel, createdDate: Date, updatedDate: Date, deletedDate: Date) {
    this.id = id;
    this.numberOfUsers = numberOfUsers;
    this.remainingUsers = remainingUsers;
    this.userCompanyInfo = userCompanyInfo;
    this.adminPasses = adminPasses;
    this.updatedDate = updatedDate;
    this.createdDate = createdDate;
    this.deletedDate = deletedDate;
  }
}
