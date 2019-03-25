import { Routes } from '@angular/router';

import {CompanyUsersComponent} from './company-users.component';


export const CompanyUsersRoutes: Routes = [
  { path: '', component: CompanyUsersComponent, data: { title: 'Company Users' } }
];
