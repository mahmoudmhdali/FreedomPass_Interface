import {Routes} from '@angular/router';
import {SubscriptionsComponent} from './subscriptions.component';

export const SubscriptionsRoutes: Routes = [
  {
    path: '',
    component: SubscriptionsComponent,
    data: {title: 'Packages', breadcrumb: 'Packages'}
  }
];
