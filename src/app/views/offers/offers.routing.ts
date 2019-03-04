import {Routes} from '@angular/router';
import {OffersComponent} from './offers.component';

export const OffersRoutes: Routes = [
  {
    path: '',
    component: OffersComponent,
    data: {title: 'Offers', breadcrumb: 'Offers'}
  }
];
