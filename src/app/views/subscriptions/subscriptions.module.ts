import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SharedModule} from '../../shared/shared.module';
import {SubscriptionsComponent} from './subscriptions.component';
import {NgxSubsciptionsPopupComponent} from './ngx-table-popup/ngx-subsciptions-popup.component';
import {SubscriptionsRoutes} from './subscriptions.routing';
import {AdminPassesService} from '../../shared/services/database-services/adminPasses.service';
import {UserOutletOffersService} from '../../shared/services/database-services/userOutletOffers.service';

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
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    SharedModule,
    RouterModule.forChild(SubscriptionsRoutes)
  ],
  declarations: [SubscriptionsComponent, NgxSubsciptionsPopupComponent],
  providers: [AdminPassesService, UserOutletOffersService],
  entryComponents: [NgxSubsciptionsPopupComponent]
})
export class SubscriptionsModule {
}
