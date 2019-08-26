import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {AppConfirmService} from '../../shared/services/app-confirm/app-confirm.service';
import {AppLoaderService} from '../../shared/services/app-loader/app-loader.service';
import {egretAnimations} from '../../shared/animations/egret-animations';
import {GlobalService} from '../../shared/services/global.service';
import {AdminPassesModel} from '../../shared/models/AdminPasses.model';
import {AdminPassesService} from '../../shared/services/database-services/adminPasses.service';
import {UserOutletOffersService} from '../../shared/services/database-services/userOutletOffers.service';
import {forkJoin} from 'rxjs';
import {ResponseBuilderModel} from '../../shared/models/ResponseBuilder.model';
import {NgxSubsciptionsPopupComponent} from './ngx-table-popup/ngx-subsciptions-popup.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-subsciptions',
  templateUrl: './subscriptions.component.html',
  providers: [TranslatePipe],
  animations: egretAnimations
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
  public items: AdminPassesModel[];
  apiConfig;
  modelLoaded = 0;
  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;
  recordsPerPageValue = 10;
  loadingIndicator = false;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private adminPassesService: AdminPassesService,
    private translatePipe: TranslatePipe,
    private userOutletOffersService: UserOutletOffersService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private svcGlobal: GlobalService
  ) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit() {
    this.getPackages();
  }

  getPackages() {
    this.loadingIndicator = true;
    this.adminPassesService.getAllPassesPagingPackagesSubsc(this.currentPage, this.itemsPerPage).subscribe(
      (responseBuilder) => {
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.items = responseBuilder.data.passes.passes;
          for (const item of this.items) {
            item.numberOfOffers = 0;
            item.numberOfPasses = 0;
            for (const offer of item.userOutletOfferCollection) {
              if (offer.outletOfferType.id === 1) {
                item.numberOfOffers = item.numberOfOffers + 1;
              } else if (offer.outletOfferType.id === 2) {
                item.numberOfPasses = item.numberOfPasses + 1;
              }
            }
          }
          this.totalItems = responseBuilder.data.passes.totalResults;
          this.modelLoaded++;
          this.loadingIndicator = false;
        }
      }
    );
  }

  ngOnDestroy() {
  }

  onPageSorted(event) {
  }

  handlePageChange(event) {
    this.currentPage = event.offset + 1;
    this.loadingIndicator = true;
    this.adminPassesService.getAllPassesPagingPackagesSubsc(this.currentPage, this.itemsPerPage).subscribe(
      (responseBuilder) => {
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.items = responseBuilder.data.passes.passes;
          for (const item of this.items) {
            item.numberOfOffers = 0;
            item.numberOfPasses = 0;
            for (const offer of item.userOutletOfferCollection) {
              if (offer.outletOfferType.id === 1) {
                item.numberOfOffers = item.numberOfOffers + 1;
              } else if (offer.outletOfferType.id === 2) {
                item.numberOfPasses = item.numberOfPasses + 1;
              }
            }
          }
          this.totalItems = responseBuilder.data.passes.totalResults;
          this.loadingIndicator = false;
        }
      }
    );
  }

  openPopUp(data: any = {}, isNew?) {
    this.loader.open('Please Wait...');
    let offers = [];
    let passes = [];
    forkJoin([this.userOutletOffersService.getAllOffersByType(1), this.userOutletOffersService.getAllOffersByType(2)])
      .subscribe((responses: ResponseBuilderModel[]) => {
        if (responses[0].code === +this.apiConfig.SUCCESS) {
          offers = responses[0].data.userOutletOffer;
        }
        if (responses[1].code === +this.apiConfig.SUCCESS) {
          passes = responses[1].data.userOutletOffer;
        }
        if (responses[0].code === +this.apiConfig.SUCCESS && responses[1].code === +this.apiConfig.SUCCESS) {
          this.loader.close();
          const title = isNew ? 'Add new subsciption' : 'Update subsciption';
          const dialogRef: MatDialogRef<any> = this.dialog.open(NgxSubsciptionsPopupComponent, {
            width: '720px',
            disableClose: true,
            data: {title: title, payload: data, offers: offers, passes: passes, isNew: isNew}
          });
          dialogRef.afterClosed()
            .subscribe(res => {
              if (!res) {
                return;
              }
              this.getPackages();
            });
        }
      });
  }

  deleteItem(data) {
    this.confirmService.confirm({
      title: this.translatePipe.transform('CONFIRMDIALOG'),
      message: this.translatePipe.transform('DELETECONFIRMATION') + ` \"${data.name}\"?`
    }).subscribe((result) => {
      if (result === true) {
        this.loader.open(this.translatePipe.transform('PLEASEWAIT'));
        this.adminPassesService.removePackage(data.id).subscribe(
          (responseBuilder: ResponseBuilderModel) => {
            if (responseBuilder.code === +this.apiConfig.SUCCESS) {
              const index: number = this.items.indexOf(this.items.find(item => item.id === data.id));
              this.items.splice(index, 1);
              this.snack.open(this.translatePipe.transform('Subscription deleted successfully'),
                this.translatePipe.transform('OK'), {duration: 4000});
            } else if (responseBuilder.code === +this.apiConfig.ENTITY_NOT_FOUND) {
              this.snack.open(responseBuilder.description, this.translatePipe.transform('OK'), {duration: 4000});
            }
            this.loader.close();
          }
        );
      }
    });
  }
}
