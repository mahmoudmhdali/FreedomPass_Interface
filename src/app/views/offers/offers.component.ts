import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {AppConfirmService} from '../../shared/services/app-confirm/app-confirm.service';
import {AppLoaderService} from '../../shared/services/app-loader/app-loader.service';
import {egretAnimations} from '../../shared/animations/egret-animations';
import {UserOutletOfferModel} from '../../shared/models/UserOutletOffer.model';
import {UserOutletOffersService} from '../../shared/services/database-services/userOutletOffers.service';
import {GlobalService} from '../../shared/services/global.service';
import {UserOutletInfoService} from '../../shared/services/database-services/userOutletInfo.service';
import {forkJoin} from 'rxjs';
import {ResponseBuilderModel} from '../../shared/models/ResponseBuilder.model';
import {NgxOffersPopupComponent} from './ngx-table-popup/ngx-offers-popup.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  animations: egretAnimations
})
export class OffersComponent implements OnInit, OnDestroy {
  public items: UserOutletOfferModel[];
  apiConfig;
  modelLoaded = 0;
  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;
  recordsPerPageValue = 10;
  loadingIndicator = false;

  constructor (
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private userOutletOffersService: UserOutletOffersService,
    private userOutletInfoService: UserOutletInfoService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private svcGlobal: GlobalService
  ) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit () {
    this.getOffers();
  }

  getOffers() {
    this.loadingIndicator = true;
    this.userOutletOffersService.getAllOffersPaging(this.currentPage, this.itemsPerPage).subscribe(
      (responseBuilder) => {
        if (responseBuilder.code === + this.apiConfig.SUCCESS) {
          this.items = responseBuilder.data.offers.offers;
          this.totalItems = responseBuilder.data.offers.totalResults;
          this.modelLoaded ++;
          this.loadingIndicator = false;
        }
      }
    );
  }

  ngOnDestroy () {
  }

  onPageSorted (event) {
  }

  handlePageChange (event) {
    console.log(event.offset);
    this.currentPage = event.offset;
    this.loadingIndicator = true;
    this.loadingIndicator = false;
  }

  openPopUp (data: any = {}, isNew?) {
    this.loader.open('Please Wait...');
    let offerTypes = [];
    let outlets = [];
    forkJoin([this.userOutletOffersService.getAllTypes(), this.userOutletInfoService.getAllOutlets()])
      .subscribe((responses: ResponseBuilderModel[]) => {
        if (responses[0].code === + this.apiConfig.SUCCESS) {
          offerTypes = responses[0].data.outletOfferTypes;
        }
        if (responses[1].code === + this.apiConfig.SUCCESS) {
          outlets = responses[1].data.userOutletInfos;
        }
        if (responses[0].code === + this.apiConfig.SUCCESS && responses[1].code === + this.apiConfig.SUCCESS) {
          console.log(offerTypes);
          console.log(outlets);
          this.loader.close();
          const title = isNew ? 'Add new offer' : 'Update offer';
          const dialogRef: MatDialogRef<any> = this.dialog.open(NgxOffersPopupComponent, {
            width: '720px',
            disableClose: true,
            data: {title: title, payload: data}
          });
          dialogRef.afterClosed()
            .subscribe(res => {
              if (! res) {
                // If user press cancel
                return;
              }
              this.getOffers();
              // this.loader.open();
              // if (isNew) {
              //   this.crudService.addItem(res)
              //     .subscribe(data1 => {
              //       this.items = data1;
              //       this.loader.close();
              //       this.snack.open('Member Added!', 'OK', {duration: 4000});
              //     });
              // } else {
              //   this.crudService.updateItem(data._id, res)
              //     .subscribe(data1 => {
              //       this.items = data1;
              //       this.loader.close();
              //       this.snack.open('Member Updated!', 'OK', {duration: 4000});
              //     });
              // }
            });
        }
      });
  }

  deleteItem (row) {
    // this.confirmService.confirm({message: `Delete ${row.name}?`})
    //   .subscribe(res => {
    //     if (res) {
    //       this.loader.open();
    //       this.crudService.removeItem(row)
    //         .subscribe(data => {
    //           this.items = data;
    //           this.loader.close();
    //           this.snack.open('Member deleted!', 'OK', {duration: 4000});
    //         });
    //     }
    //   });
  }
}
