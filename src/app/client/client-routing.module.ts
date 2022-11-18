import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientRoleGuard } from '../auth/client-role.guard';
import { GuestHousesCardsComponent } from './guest-houses-cards/guest-houses-cards.component';
import { RoomsCardsComponent } from './guest-houses-cards/rooms-cards/rooms-cards.component';
import { ClientComponent } from './client.component';
import { ClientMainPageComponent } from './client-main-page/client-main-page.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { UserProfileComponent } from './user-panel/user-profile/user-profile.component';
import { UserBookingsComponent } from './user-panel/user-bookings/user-bookings.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    canActivate: [ClientRoleGuard],
    children: [
      { path: '', component: ClientMainPageComponent },
      { path: 'guestHousesCards', component: GuestHousesCardsComponent },
      {
        path: 'guestHousesCards/roomsCards/:id/:name',
        component: RoomsCardsComponent,
      },
      {
        path: 'userPanel',
        component: UserPanelComponent,
        children: [
          { path: '', component: UserProfileComponent }, //by default opens user profile
          { path: 'bookings', component: UserBookingsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
