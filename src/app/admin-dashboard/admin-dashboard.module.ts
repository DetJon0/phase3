import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { GuestHouseComponent } from '../guest-house/guest-house.component';
import { EditGuestHouseComponent } from '../guest-house/edit-guest-house/edit-guest-house.component';
import { RoomsComponent } from '../guest-house/rooms/rooms.component';
import { EditRoomComponent } from '../guest-house/rooms/edit-room/edit-room.component';
import { HeaderComponent } from '../header/header.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SharedModule } from '../shared/shared.module';
import { AdminDashboardRoutingModule } from './admin-dashboad-routing.module';
import { UserComponent } from '../user/user.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    SideBarComponent,
    HeaderComponent,
    GuestHouseComponent,
    RoomsComponent,
    EditRoomComponent,
    EditGuestHouseComponent,
    UserComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    AdminDashboardRoutingModule,
    NgDynamicBreadcrumbModule,
    NgxBootstrapMultiselectModule,
  ],
})
export class AdminDashboardModule {}
