import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { GuestHouse } from 'src/app/shared/guestHouse.model';
import { RoomsService } from '../rooms.service';

@Component({
  selector: 'app-edit-guest-house',
  templateUrl: './edit-guest-house.component.html',
  styleUrls: ['./edit-guest-house.component.css'],
})
export class EditGuestHouseComponent implements OnInit, OnDestroy {
  guestHouseForm: FormGroup;
  @Input() guestHouseData: GuestHouse = null;

  isLoading = false;

  hasFormDataChanged = false;
  hasValueChangedSub: Subscription;

  constructor(
    private roomsService: RoomsService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    if (this.guestHouseData) {
      this.createForm(
        this.guestHouseData.name,
        this.guestHouseData.description
      );
    } else {
      this.createForm(null, null);
    }

    this.hasValueChangedSub = this.guestHouseForm.valueChanges.subscribe(() => {
      this.hasFormDataChanged = true;
    });
  }
  private createForm(name: string, desc: string) {
    this.guestHouseForm = new FormGroup({
      ghName: new FormControl(name, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      ghDescription: new FormControl(desc, [
        Validators.required,
        Validators.maxLength(60),
      ]),
    });
  }

  onSubmit() {
    if (!this.guestHouseForm.valid) {
      this.guestHouseForm.markAllAsTouched();
      return;
    }

    if (!this.hasFormDataChanged) {
      this.onHideGuestForm();
      return;
    }

    // if( this.guestHouseData &&
    // this.guestHouseData.name === this.guestHouseForm.value.ghName &&
    // this.guestHouseData.description === this.guestHouseForm.value.ghDescription){
    //   this.onHideGuestForm();
    //   return;
    // }

    const newGh: GuestHouse = {
      id: this.guestHouseData ? this.guestHouseData.id : 0,
      name: this.guestHouseForm.value.ghName,
      description: this.guestHouseForm.value.ghDescription,
    };

    this.isLoading = true;
    if (this.guestHouseData) {
      this.roomsService.editGuestHouse(newGh).subscribe({
        next: (data) => {
          //this.isLoading = false;
          this.onHideGuestForm(data);
        },
        error: (error) => {
          this.onHideGuestForm(
            null,
            'Guest House can not be edited. Please try again later!'
          );
        },
      });
    } else {
      this.roomsService.addGuestHouse(newGh).subscribe({
        next: (data) => {
          this.onHideGuestForm(data);
        },
        error: (error) => {
          this.onHideGuestForm(
            null,
            'Guest House can not be added. Please try again later!'
          );
        },
      });
    }
  }

  onHideGuestForm(newghData: GuestHouse = null, errorMsg: string = null) {
    const data = {
      ghData: newghData,
      errorMsg: errorMsg,
    };
    this.ngbActiveModal.close(data);
  }

  ngOnDestroy() {
    this.hasValueChangedSub && this.hasValueChangedSub.unsubscribe();
  }
}
