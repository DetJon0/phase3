import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
})
export class UserPanelComponent implements OnInit, OnDestroy {
  loginUserSub: Subscription;
  bookingDataReceived = false;

  isLoading = false;
  errorMessage: string;
  userId: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loginUserSub = this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
    //ketu do lexoj userData dhe sa here qe mund te nderrohen slidet nuk kam pse nis kerkesa kot

    if (
      //nese jam tek tab i bookings e bej reload nuk do te behej kerkesa ne back per data
      this.route.snapshot['_routerState'].url ===
        '/client/userPanel/bookings' &&
      !this.bookingDataReceived
    ) {
      this.onBookingData();
    }

    this.isLoading = true;
    this.userService.getUserData(this.userId).subscribe({
      next: (userData) => {
        this.isLoading = false;
        this.userService.userProfileData.next(userData); //i bej next te dhenave qe te kapen nga komponentja - dhe te mos bej kerkesa sa here nderrohet tabi
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          'An error accrued while fetching your profile data. Please try again later';
      },
    });
  }

  // ngAfterViewInit(): void {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'smooth',
  //   });
  // }

  onBookingData() {
    //kur te klikoj kete per here te pare do te marr te dhenat dhe i ruaj ketu, nuk kam pse nis kerkesa sa here qe do nderrohen keto linke
    if (!this.bookingDataReceived) {
      this.isLoading = true;
      this.userService.getUserBookings(this.userId).subscribe({
        next: (userBookingsData) => {
          this.isLoading = false;

          this.userService.userBookingsData.next(userBookingsData); //i bej next te dhenave qe te kapen nga komponentja - dhe te mos bej kerkesa sa here nderrohet tabi
          this.bookingDataReceived = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            'An error accrued while fetching your booking data. Please try again later';
        },
      });
    }
  }

  ngOnDestroy() {
    this.loginUserSub && this.loginUserSub.unsubscribe();
  }
}
