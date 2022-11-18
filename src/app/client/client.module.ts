import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GuestHousesCardsComponent } from './guest-houses-cards/guest-houses-cards.component';
import { BookingRoomComponent } from './guest-houses-cards/rooms-cards/booking-room/booking-room.component';
import { RoomsCardsComponent } from './guest-houses-cards/rooms-cards/rooms-cards.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientMainPageComponent } from './client-main-page/client-main-page.component';
import { ClientComponent } from './client.component';
import { UserProfileComponent } from './user-panel/user-profile/user-profile.component';
import { UserBookingsComponent } from './user-panel/user-bookings/user-bookings.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PasswordModalComponent } from './user-panel/user-profile/password-modal/password-modal.component';
import { ClientHeaderComponent } from './client-header/client-header.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientMainPageComponent,
    GuestHousesCardsComponent,
    RoomsCardsComponent,
    BookingRoomComponent,
    UserPanelComponent,
    UserProfileComponent,
    UserBookingsComponent,
    PasswordModalComponent,
    ClientHeaderComponent,
  ],
  imports: [
    SharedModule,
    ClientRoutingModule,
    CarouselModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
})
export class ClientModule {}
