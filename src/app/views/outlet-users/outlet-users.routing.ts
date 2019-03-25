import { Routes } from '@angular/router';

import {OutletUsersComponent} from './outlet-users.component';


export const OutletUsersRoutes: Routes = [
  { path: '', component: OutletUsersComponent, data: { title: 'Users' } }
];
