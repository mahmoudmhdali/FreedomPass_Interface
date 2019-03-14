import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule, MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SharedModule} from '../../shared/shared.module';
import {CompanyPackagesComponent} from './company-packages.component';
import {NgxCompanyPackagesPopupComponent} from './ngx-table-popup/ngx-company-packages-popup.component';
import {UserOutletOffersService} from '../../shared/services/database-services/userOutletOffers.service';
import {UserOutletInfoService} from '../../shared/services/database-services/userOutletInfo.service';
import {CompanyPackagesRoutes} from './company-packages.routing';
import {UserCompanyPassesService} from '../../shared/services/database-services/userCompanyPasses.service';
import {UserCompanyInfoService} from '../../shared/services/database-services/userCompanyInfo.service';
import {AdminPassesService} from '../../shared/services/database-services/adminPasses.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    SharedModule,
    RouterModule.forChild(CompanyPackagesRoutes)
  ],
  declarations: [CompanyPackagesComponent, NgxCompanyPackagesPopupComponent],
  providers: [UserCompanyPassesService, UserCompanyInfoService, AdminPassesService],
  entryComponents: [NgxCompanyPackagesPopupComponent]
})
export class CompanyPackagesModule {
}
