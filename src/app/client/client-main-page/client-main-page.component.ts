import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ghWithImg, UserService } from '../user.service';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-main-page.component.html',
  styleUrls: ['./client-main-page.component.css'],
})
export class ClientMainPageComponent implements OnInit {
  guestHouses: ghWithImg[] = [];

  searchRooms: FormGroup;
  today = new Date();

  isLoading = false;
  errorMessage: string;

  bsConfig: Partial<BsDatepickerConfig> = Object.assign(
    {},
    { containerClass: 'theme-dark-blue round-border' }
  );

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getTop5gh().subscribe({
      next: (ghData) => {
        this.isLoading = false;
        this.guestHouses = ghData;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          'Error while trying to fetch your data. Please try again later.';
      },
    });

    this.searchRooms = new FormGroup(
      {
        'check-in': new FormControl(null, [Validators.required]),
        'check-out': new FormControl(null, [Validators.required]),
        'num-beds': new FormControl(null, [
          Validators.required,
          Validators.min(1),
        ]),
      },
      this.isCheckoutBeforeValidator.bind(this)
    );
  }

  isCheckoutBeforeValidator(): { [s: string]: boolean } {
    if (
      this.searchRooms?.get('check-in')?.value &&
      this.searchRooms?.get('check-out')?.value
    ) {
      const dayBefore =
        // this.searchRooms.get('check-in') &&
        new Date(this.searchRooms.get('check-in').value);

      const dayAfter =
        // this.searchRooms.get('check-out') &&
        new Date(this.searchRooms.get('check-out').value);

      dayBefore.setHours(0, 0, 0, 0);
      dayAfter.setHours(0, 0, 0, 0);

      if (dayAfter < dayBefore) {
        return { checkOutBefore: true };
      }
    }
    return null;
  }

  onSearch() {
    if (!this.searchRooms.valid) {
      this.searchRooms.markAllAsTouched();
      return;
    }
    const vlera = this.searchRooms.value['check-in'];

    this.router.navigate(['/client/guestHousesCards'], {
      queryParams: {
        checkIn: this.searchRooms.value['check-in'],
        checkOut: this.searchRooms.value['check-out'],
        numBeds: this.searchRooms.value['num-beds'],
      },
    });
  }
}
