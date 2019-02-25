import {UserCompanyInfoModel} from './UserCompanyInfo.model';
import {AdminPassesModel} from './AdminPasses.model';
import {UserPassPurchasedModel} from './UserPassPurchased.model';

export class UserCompanyPassesModel {
  public id: number;
  public numberOfUsers: number;
  public userCompanyInfo: UserCompanyInfoModel;
  public adminPasses: AdminPassesModel;
  public userPassPurchased: UserPassPurchasedModel[];
  public createdDate: Date;
  public updatedDate: Date;
  public deletedDate: Date;

  constructor(id: number, numberOfUsers: number, userCompanyInfo: UserCompanyInfoModel, adminPasses: AdminPassesModel,
              userPassPurchased: UserPassPurchasedModel[], createdDate: Date, updatedDate: Date, deletedDate: Date) {
    this.id = id;
    this.numberOfUsers = numberOfUsers;
    this.userCompanyInfo = userCompanyInfo;
    this.adminPasses = adminPasses;
    this.userPassPurchased = userPassPurchased;
    this.updatedDate = updatedDate;
    this.createdDate = createdDate;
    this.deletedDate = deletedDate;
  }
}
