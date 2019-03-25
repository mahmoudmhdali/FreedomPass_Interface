import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppConfirmModule} from '../../shared/services/app-confirm/app-confirm.module';
import {AppLoaderModule} from '../../shared/services/app-loader/app-loader.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateModule} from '@ngx-translate/core';
import {NgxCompanyUsersPopupComponent} from './ngx-company-users-popup/ngx-company-users-popup.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {UserCompanyPassesService} from '../../shared/services/database-services/userCompanyPasses.service';
import {CompanyUsersRoutes} from './company-users.routing';
import {CompanyUsersComponent} from './company-users.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ChartsModule,
    NgxDatatableModule,
    SharedModule,
    AppConfirmModule,
    AppLoaderModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    TranslateModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    NgxPermissionsModule,
    NgxPaginationModule,
    MatGridListModule,
    MatSelectModule,
    FormsModule,
    MatSelectModule,
    RouterModule.forChild(CompanyUsersRoutes)
  ],
  declarations: [CompanyUsersComponent, NgxCompanyUsersPopupComponent],
  entryComponents: [NgxCompanyUsersPopupComponent],
  providers: [UserCompanyPassesService],
  exports: []
})
export class CompanyUsersModule {

}
