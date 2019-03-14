import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {AppConfirmService} from '../../shared/services/app-confirm/app-confirm.service';
import {AppLoaderService} from '../../shared/services/app-loader/app-loader.service';
import {egretAnimations} from '../../shared/animations/egret-animations';
import {GlobalService} from '../../shared/services/global.service';
import {forkJoin} from 'rxjs';
import {ResponseBuilderModel} from '../../shared/models/ResponseBuilder.model';
import {NgxCompanyPackagesPopupComponent} from './ngx-table-popup/ngx-company-packages-popup.component';
import {UserCompanyPassesModel} from '../../shared/models/UserCompanyPasses.model';
import {UserCompanyPassesService} from '../../shared/services/database-services/userCompanyPasses.service';
import {UserCompanyInfoService} from '../../shared/services/database-services/userCompanyInfo.service';
import {AdminPassesService} from '../../shared/services/database-services/adminPasses.service';

@Component({
  selector: 'app-company-packages',
  templateUrl: './company-packages.component.html',
  animations: egretAnimations
})
export class CompanyPackagesComponent implements OnInit, OnDestroy {
  public items: UserCompanyPassesModel[];
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
    private userCompanyPassesService: UserCompanyPassesService,
    private userCompanyInfoService: UserCompanyInfoService,
    private adminPassesService: AdminPassesService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private svcGlobal: GlobalService
  ) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit () {
    this.getCompanyPasses();
  }

  getCompanyPasses () {
    this.loadingIndicator = true;
    this.userCompanyPassesService.getAllCompanyPassesPaging(this.currentPage, this.itemsPerPage).subscribe(
      (responseBuilder) => {
        if (responseBuilder.code === + this.apiConfig.SUCCESS) {
          this.items = responseBuilder.data.userCompanyPasses.userCompanyPasses;
          this.totalItems = responseBuilder.data.userCompanyPasses.totalResults;
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
    this.currentPage = event.offset + 1;
    this.loadingIndicator = true;
    this.userCompanyPassesService.getAllCompanyPassesPaging(this.currentPage, this.itemsPerPage).subscribe(
      (responseBuilder) => {
        if (responseBuilder.code === + this.apiConfig.SUCCESS) {
          this.items = responseBuilder.data.userCompanyPasses.userCompanyPasses;
          this.totalItems = responseBuilder.data.userCompanyPasses.totalResults;
          this.loadingIndicator = false;
        }
      }
    );
  }

  openPopUp (data: any = {}, isNew?) {
    this.loader.open('Please Wait...');
    let companies = [];
    let passes = [];
    forkJoin([this.userCompanyInfoService.getAllCompanies(), this.adminPassesService.getAllPasses()])
      .subscribe((responses: ResponseBuilderModel[]) => {
        if (responses[0].code === + this.apiConfig.SUCCESS) {
          companies = responses[0].data.users;
        }
        if (responses[1].code === + this.apiConfig.SUCCESS) {
          passes = responses[1].data.adminPasses;
        }
        if (responses[0].code === + this.apiConfig.SUCCESS && responses[1].code === + this.apiConfig.SUCCESS) {
          this.loader.close();
          const title = isNew ? 'Add new company package' : 'Update company package';
          const dialogRef: MatDialogRef<any> = this.dialog.open(NgxCompanyPackagesPopupComponent, {
            width: '720px',
            disableClose: true,
            data: {title: title, payload: data, companies: companies, passes: passes, isNew: isNew}
          });
          dialogRef.afterClosed()
            .subscribe(res => {
              if (! res) {
                // If user press cancel
                return;
              }
              this.getCompanyPasses();
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
