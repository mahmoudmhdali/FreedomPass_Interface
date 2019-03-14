import {UserProfileModel} from './UserProfile.model';
import {AdminPassesModel} from './AdminPasses.model';

export class UserPassPurchasedModel {
  public id: number;
  public isPaid: boolean;
  public status: number;
  public validTill: Date;
  public userProfileId: UserProfileModel;
  public adminPasses: AdminPassesModel;

  constructor(id: number, isPaid: boolean, status: number, validTill: Date, userProfileId: UserProfileModel,
              adminPasses: AdminPassesModel) {
    this.id = id;
    this.isPaid = isPaid;
    this.status = status;
    this.validTill = validTill;
    this.userProfileId = userProfileId;
    this.adminPasses = adminPasses;
  }
}
