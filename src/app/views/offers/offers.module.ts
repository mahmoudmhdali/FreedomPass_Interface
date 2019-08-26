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
import {OffersComponent} from './offers.component';
import {NgxOffersPopupComponent} from './ngx-table-popup/ngx-offers-popup.component';
import {UserOutletOffersService} from '../../shared/services/database-services/userOutletOffers.service';
import {UserOutletInfoService} from '../../shared/services/database-services/userOutletInfo.service';
import {OffersRoutes} from './offers.routing';
import {TranslateModule} from '@ngx-translate/core';

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
    TranslateModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    SharedModule,
    RouterModule.forChild(OffersRoutes)
  ],
  declarations: [OffersComponent, NgxOffersPopupComponent],
  providers: [UserOutletOffersService, UserOutletInfoService],
  entryComponents: [NgxOffersPopupComponent]
})
export class OffersModule {
}
