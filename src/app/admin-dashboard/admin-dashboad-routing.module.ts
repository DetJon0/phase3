import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRoleGuard } from '../auth/admin-role.guard';

import { GuestHouseComponent } from '../guest-house/guest-house.component';
import { RoomsComponent } from '../guest-house/rooms/rooms.component';
import { UserComponent } from '../user/user.component';
import { AdminDashboardComponent } from './admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AdminRoleGuard],
    data: {
      title: 'admin',
      breadcrumb: [
        {
          label: 'Dashboard',
          url: '',
        },
      ],
    },
    children: [
      {
        path: 'guestHouse',
        component: GuestHouseComponent,
        data: {
          title: 'guestHouse',
          breadcrumb: [
            {
              label: 'Dashboard',
              url: '/admin',
            },
            {
              label: 'Guest-House',
              url: '',
            },
          ],
        },
      },
      {
        path: 'guestHouse/rooms/:id/:name',
        component: RoomsComponent,
        data: {
          title: 'page2',
          breadcrumb: [
            {
              label: 'Dashboard',
              url: '/admin',
            },
            {
              label: 'Guest House', // pageOneID Parameter value will be add
              url: '/admin/guestHouse',
            },
            {
              label: 'Rooms', // pageTwoID Parameter value will be add
              url: '',
            },
          ],
        },
      },
      {
        path: 'users',
        component: UserComponent,
        data: {
          title: 'users',
          breadcrumb: [
            {
              label: 'Dashboard',
              url: '/admin',
            },
            {
              label: 'Users',
              url: '',
            },
          ],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
