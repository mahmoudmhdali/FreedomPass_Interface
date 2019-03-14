import {Routes} from '@angular/router';
import {CompanyPackagesComponent} from './company-packages.component';

export const CompanyPackagesRoutes: Routes = [
  {
    path: '',
    component: CompanyPackagesComponent,
    data: {title: 'Companies Packages', breadcrumb: 'Companies Packages'}
  }
];
