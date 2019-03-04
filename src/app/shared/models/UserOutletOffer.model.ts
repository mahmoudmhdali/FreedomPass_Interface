import {UserOutletInfoModel} from './UserOutletInfo.model';
import {OutletOfferTypeModel} from './OutletOfferType.model';
import {AdminPassesModel} from './AdminPasses.model';
import {UserOutletOfferPurchasedModel} from './UserOutletOfferPurchased.model';

export class UserOutletOfferModel {
  public id: number;
  public numberOfUsage: number;
  public validity: number;
  public typeOfUsage: number;
  public userOutletInfo: UserOutletInfoModel;
  public outletOfferType: OutletOfferTypeModel;
  public userOutletOfferPurchased: UserOutletOfferPurchasedModel[];
  public adminPassesCollection: AdminPassesModel[];
  public createdDate: Date;
  public updatedDate: Date;
  public deletedDate: Date;
  public userOutletID: number;
  public userOutletName: string;
  public name: string;
  public info: string;

  constructor (id: number, numberOfUsage: number, validity: number, typeOfUsage: number, userOutletInfo: UserOutletInfoModel,
               outletOfferType: OutletOfferTypeModel, userOutletOfferPurchased: UserOutletOfferPurchasedModel[],
               adminPassesCollection: AdminPassesModel[], createdDate: Date, updatedDate: Date, deletedDate: Date,
               userOutletID: number, userOutletName: string, name: string, info: string) {
    this.id = id;
    this.numberOfUsage = numberOfUsage;
    this.validity = validity;
    this.typeOfUsage = typeOfUsage;
    this.userOutletInfo = userOutletInfo;
    this.outletOfferType = outletOfferType;
    this.userOutletOfferPurchased = userOutletOfferPurchased;
    this.adminPassesCollection = adminPassesCollection;
    this.updatedDate = updatedDate;
    this.createdDate = createdDate;
    this.deletedDate = deletedDate;
    this.info = info;
    this.name = name;
    this.userOutletName = userOutletName;
    this.userOutletID = userOutletID;
  }
}
