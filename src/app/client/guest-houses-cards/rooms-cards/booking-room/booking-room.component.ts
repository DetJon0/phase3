import { Component, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/client/user.service';
import { BookingModel } from 'src/app/shared/models/booking.model';
import { Room } from 'src/app/shared/room.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-booking-room',
  templateUrl: './booking-room.component.html',
  styleUrls: ['./booking-room.component.css'],
})
export class BookingRoomComponent implements OnInit {
  @Input() roomData: Room;

  bookingForm: FormGroup;
  bookedDates: Date[];

  today = new Date();

  isLoading = false;
  isError: boolean;
  displayMessage: string;
  isRangeForbidden = false;

  bsConfig: Partial<BsDatepickerConfig> = Object.assign(
    {},
    { containerClass: 'theme-dark-blue round-border' }
  );

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getRoomBookedDates(this.roomData.id).subscribe({
      next: (bookedDates) => {
        this.isLoading = false;
        this.bookedDates = bookedDates;
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.displayMessage = 'Error while retrieving available dates.';
      },
    });

    this.bookingForm = new FormGroup(
      {
        'check-in': new FormControl(null, [Validators.required]),
        'check-out': new FormControl(null, [Validators.required]),
      },
      [
        this.isCheckoutBeforeValidator.bind(this),
        this.rangeForbidden.bind(this),
      ]
    );
  }

  isInThePast(control: FormControl): { [s: string]: boolean } {
    if (new Date(control.value).getDate() < this.today.getDate()) {
      return { inThePast: true };
    }
    return null;
  }

  /**
   *
   * @returns true if checkout is before checkin, false if is later than checkin
   */
  isCheckoutBeforeValidator(): { [s: string]: boolean } {
    if (
      this.bookingForm?.get('check-in')?.value &&
      this.bookingForm?.get('check-out')?.value
    ) {
      const dayBefore = new Date(this.bookingForm.get('check-in').value);

      const dayAfter = new Date(this.bookingForm.get('check-out').value);

      dayBefore.setHours(0, 0, 0, 0);
      dayAfter.setHours(0, 0, 0, 0);

      if (dayAfter < dayBefore) {
        return { checkOutBefore: true };
      }
    }
    return null;
  }

  onSubmit() {
    if (!this.bookingForm.valid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const bookingData: BookingModel = {
      id: 0,
      roomId: this.roomData.id,
      bookFrom: new Date(this.bookingForm.value['check-in']),
      bookTo: new Date(this.bookingForm.value['check-out']),
      room: this.roomData, // e kishte shtu backu sepse nuk ishte
    };

    this.isLoading = true;
    this.userService.bookRoom(bookingData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isError = false;
        this.displayMessage = `Room '${
          this.roomData.name
        }' is booked successfully from ${formatDate(
          bookingData.bookFrom,
          'dd/MM/yyyy',
          'en-US'
        )}-${formatDate(bookingData.bookTo, 'dd/MM/yyyy', 'en-US')}.`;
        setInterval(() => this.activeModal.close(), 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.displayMessage = `An error accrued. Please, try again later!`;
      },
    });
  }

  rangeForbidden() {
    if (
      !this.bookingForm?.get('check-in')?.value ||
      !this.bookingForm?.get('check-out')?.value
    )
      return null;

    const dStart = new Date(this.bookingForm.value['check-in']);
    const dEnd = new Date(this.bookingForm.value['check-out']);
    for (
      let dTemp = dStart;
      dTemp.getDate() <= dEnd.getDate();
      dTemp.setDate(dTemp.getDate() + 1)
    ) {
      for (let i = 0; i < this.bookedDates.length; i++) {
        if (
          formatDate(this.bookedDates[i], 'dd/MM/yyyy', 'en-US') ===
          formatDate(dTemp, 'dd/MM/yyyy', 'en-US')
        ) {
          return { rangeForbidden: true };
        }
      }
    }
    return null;
  }
}
