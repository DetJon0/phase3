import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ghWithImg, UserService } from '../user.service';

@Component({
  selector: 'app-guest-houses-cards',
  templateUrl: './guest-houses-cards.component.html',
  styleUrls: ['./guest-houses-cards.component.css'],
})
export class GuestHousesCardsComponent implements OnInit {
  guestHouses: ghWithImg[];

  checkIn: Date;
  checkOut: Date;
  numBeds: number;

  isLoading = false;
  errorMessage: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((qParams) => {
      this.checkIn = new Date(qParams['checkIn']);
      this.checkOut = new Date(qParams['checkOut']);
      this.numBeds = qParams['numBeds'];

      this.isLoading = true;
      if (this.checkIn && this.checkOut && this.numBeds) {
        this.userService
          .getSearchGuestHouse(this.checkIn, this.checkOut, this.numBeds)
          .subscribe({
            next: (searchedGhs) => {
              this.isLoading = false;
              this.errorMessage = null;
              this.guestHouses = searchedGhs;
            },
            error: (error) => {
              this.isLoading = false;
              this.errorMessage =
                'An error accrued while fetching your searching data.';
            },
          });
      } else {
        this.userService.getAllGuestHouses().subscribe({
          next: (ghs) => {
            this.isLoading = false;
            this.errorMessage = null;
            this.guestHouses = ghs;
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage =
              'An error accrued while fetching the guesthouses.';
          },
        });
      }
    });
  }
}
