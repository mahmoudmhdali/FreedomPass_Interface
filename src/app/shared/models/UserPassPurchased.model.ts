import {UserProfileModel} from './UserProfile.model';
import {UserCompanyPassesModel} from './UserCompanyPasses.model';

export class UserPassPurchasedModel {
  public id: number;
  public isPaid: boolean;
  public status: number;
  public validTill: Date;
  public userProfileId: UserProfileModel;
  public userCompanyPasses: UserCompanyPassesModel;

  constructor(id: number, isPaid: boolean, status: number, validTill: Date, userProfileId: UserProfileModel,
              userCompanyPasses: UserCompanyPassesModel) {
    this.id = id;
    this.isPaid = isPaid;
    this.status = status;
    this.validTill = validTill;
    this.userProfileId = userProfileId;
    this.userCompanyPasses = userCompanyPasses;
  }
}
