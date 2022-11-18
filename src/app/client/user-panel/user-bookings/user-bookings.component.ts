import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css'],
})
export class UserBookingsComponent implements OnInit {
  faInfo = faCircleInfo;

  bookingsData = [];
  filteredBookingsData = [];
  // array me booking data, duhet bo nje model
  userBookingSub: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userBookingSub = this.userService.userBookingsData.subscribe(
      (userBookingData) => {
        this.bookingsData = userBookingData;
        this.filteredBookingsData = this.bookingsData;
      }
    );
  }

  onSearch(event: InputEvent) {
    // console.log(event);
    // console.log(event.target['value']);
    const searchVal = event.target['value'];
    this.filteredBookingsData = this.bookingsData.filter((el) => {
      return (
        el.room.name.toLowerCase().includes(searchVal) ||
        formatDate(el.bookTo, 'd/M/yyyy', 'en-US').includes(searchVal) ||
        formatDate(el.bookFrom, 'd/M/yyyy', 'en-US').includes(searchVal)
      );
    });
  }

  ngOnDestroy() {
    this.userBookingSub && this.userBookingSub.unsubscribe();
  }
}
