import {UserCompanyPassesModel} from './UserCompanyPasses.model';
import {UserOutletOfferModel} from './UserOutletOffer.model';

export class AdminPassesModel {
  public id: number;
  public validity: number;
  public name: string;
  public description: string;
  public imagePath: string;
  public userCompanyPasses: UserCompanyPassesModel[];
  public userOutletOfferCollection: UserOutletOfferModel[];
  public createdDate: Date;
  public updatedDate: Date;
  public deletedDate: Date;

  constructor(id: number, validity: number, name: string, description: string,
              imagePath: string, userCompanyPasses: UserCompanyPassesModel[], userOutletOfferCollection: UserOutletOfferModel[],
              createdDate: Date, updatedDate: Date, deletedDate: Date) {
    this.id = id;
    this.validity = validity;
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.userCompanyPasses = userCompanyPasses;
    this.userOutletOfferCollection = userOutletOfferCollection;
    this.updatedDate = updatedDate;
    this.createdDate = createdDate;
    this.deletedDate = deletedDate;
  }
}
