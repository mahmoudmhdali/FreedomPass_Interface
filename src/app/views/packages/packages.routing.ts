import {Routes} from '@angular/router';
import {PackagesComponent} from './packages.component';

export const PackagesRoutes: Routes = [
  {
    path: '',
    component: PackagesComponent,
    data: {title: 'Packages', breadcrumb: 'Packages'}
  }
];
