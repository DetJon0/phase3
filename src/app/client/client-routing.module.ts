import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { ClientRoleGuard } from '../auth/client-role.guard';
import { GuestHousesCardsComponent } from './guest-houses-cards/guest-houses-cards.component';
import { BookingRoomComponent } from './guest-houses-cards/rooms-cards/booking-room/booking-room.component';
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
        //do bohet me modal, dhe si rrjedhoje sdo na duhet kjo route
        path: 'guestHousesCards/roomsCards/:id/:name/roomDetails/:id',
        component: BookingRoomComponent,
      },
      {
        path: 'userPanel',
        component: UserPanelComponent,
        children: [
          { path: '', component: UserProfileComponent }, //by default te hap profilin e userit
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
