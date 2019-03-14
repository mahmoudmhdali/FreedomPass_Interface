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
import {PackagesComponent} from './packages.component';
import {NgxPackagesPopupComponent} from './ngx-table-popup/ngx-packages-popup.component';
import {PackagesRoutes} from './packages.routing';
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
    MatSelectModule,
    MatSlideToggleModule,
    SharedModule,
    RouterModule.forChild(PackagesRoutes)
  ],
  declarations: [PackagesComponent, NgxPackagesPopupComponent],
  providers: [AdminPassesService, UserOutletOffersService],
  entryComponents: [NgxPackagesPopupComponent]
})
export class PackagesModule {
}
