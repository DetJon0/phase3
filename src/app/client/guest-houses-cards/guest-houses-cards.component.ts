import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestHouse } from 'src/app/shared/guestHouse.model';
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
  // ngAfterViewInit(): void {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'smooth',
  //   });
  // }

  ngOnInit(): void {
    // this.checkIn = this.route.snapshot.queryParams.checkIn;
    // this.checkOut = this.route.snapshot.queryParams.checkOut;
    // this.numBeds = this.route.snapshot.queryParams.numBeds;

    this.route.queryParams.subscribe((qParams) => {
      this.checkIn = new Date(qParams['checkIn']);
      this.checkOut = new Date(qParams['checkOut']);
      this.numBeds = qParams['numBeds'];

      this.isLoading = true;
      if (this.checkIn && this.checkOut && this.numBeds) {
        // console.log('search Mode....');
        // console.log(this.userService.dateFormat(this.checkIn));
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

    // console.log(
    //   this.checkIn instanceof Date,
    //   this.checkOut ? true : false,
    //   this.numBeds
    // );
    // if (this.checkIn && this.checkOut && this.numBeds) {
    //   console.log('search Mode....');
    //   this.guestHouses = [];
    // } else {
    //   this.userService.getAllGuestHouses().subscribe((ghs) => {
    //     this.guestHouses = ghs;
    //   });
    // }
  }

  //mund te kalojme te gjithe guestHousin me ane te routert me dinamyc data...
  // onViewDetails(gh:GuestHouse){
  //   this.router.navigate([''], {data:})
  // }

  /**
   *
   * duhet te shtohet logjika per afishimin e search-it
   */
}
