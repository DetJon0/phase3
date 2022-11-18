import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts,
} from 'ngx-bootstrap-multiselect';
import { Room } from 'src/app/shared/room.model';
import { AmenitiesEnum } from 'src/app/shared/shared.module';
import { RoomsService } from '../../rooms.service';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css'],
})
export class EditRoomComponent implements OnInit {
  roomForm: FormGroup;

  base64Img: string;
  hasImg = false;
  DEFAULT_PART = 'data:image/png;base64,';

  @Input() roomData: Room;
  @Input() ghId: number; //duhet ku nuk kam room data, tek shtimi

  isLoading = false;

  // amenitiesValues: number[] = Object.keys(AmenitiesEnum)
  //   .filter((v) => !isNaN(Number(v)))
  //   .map((el) => parseInt(el));
  amenitiesValues: IMultiSelectOption[] = <IMultiSelectOption[]>Object.values(
    AmenitiesEnum
  )
    .filter((val) => !Number.isInteger(val))
    .map((val, ind) => {
      return {
        id: ind,
        name: val,
      };
    });
  mySettings: IMultiSelectSettings = {
    buttonClasses: 'btn btn-default btn-block px-2 py-1 ',
  };
  myTexts: IMultiSelectTexts = {
    defaultTitle: 'Amenities',
  };

  constructor(
    private roomsService: RoomsService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    // console.log(this.amenitiesValues);
    if (this.roomData) {
      this.createRoomForm(
        this.roomData.name,
        this.roomData.description,
        this.roomData.price,
        this.roomData.numberOfBeds,
        this.roomData.amenities
      );

      this.base64Img = this.roomData.image;
      this.hasImg = true;
    } else {
      this.createRoomForm(null, null, null, null, null);
    }
  }

  createRoomForm(
    name: string,
    desc: string,
    price: number,
    numBeds: number,
    amenities: AmenitiesEnum[]
  ) {
    this.roomForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      description: new FormControl(desc, [
        Validators.required,
        Validators.maxLength(60),
      ]),
      img: new FormControl(null, this.requiredImg.bind(this)), //handled manually cuz we can't give value beside "" from user, and by default takes only paths
      price: new FormControl(price, [Validators.required, Validators.min(1)]),
      numberOfBeds: new FormControl(numBeds, [
        Validators.required,
        Validators.min(1),
      ]),
      amenities: new FormControl(amenities, Validators.required),
    });
  }

  requiredImg(control: FormControl): { [s: string]: boolean } {
    if (!this.hasImg) {
      return { requiredImg: true };
    }
    return null;
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (!file) return;
    reader.readAsDataURL(file);
    reader.onload = () => {
      let temp = reader.result.toString();
      this.base64Img = temp.substring(temp.indexOf(',') + 1);
      // console.log(temp);
      // console.log(this.base64Img);
      this.hasImg = true;
      this.roomForm.get('img').updateValueAndValidity();
    };
  }

  onSubmit() {
    // console.log(this.roomForm)

    if (!this.roomForm.valid) {
      this.roomForm.markAllAsTouched();
      return;
    }

    if (
      this.roomData &&
      this.roomData.name === this.roomForm.value.name &&
      this.roomData.description === this.roomForm.value.description &&
      this.roomData.image === this.base64Img &&
      this.roomData.price === this.roomForm.value.price &&
      this.roomData.numberOfBeds === this.roomForm.value.numberOfBeds &&
      !this.roomForm.get('amenities').dirty
    ) {
      this.onHideForm();
      return;
    }

    const newRoom: Room = {
      id: this.roomData ? this.roomData.id : 0,
      name: this.roomForm.value.name,
      description: this.roomForm.value.description,
      image: this.base64Img,
      price: this.roomForm.value.price,
      numberOfBeds: this.roomForm.value.numberOfBeds,
      guestHouseId: this.ghId,
      amenities: this.roomForm.value.amenities,
    };

    this.isLoading = true;
    if (this.roomData) {
      this.roomsService.editRoom(newRoom).subscribe({
        next: (data) => {
          this.onHideForm(data);
        },
        error: (error) => {
          this.onHideForm(
            null,
            'Room can not be edited. Please try again later!'
          );
        },
      });
    } else {
      this.roomsService.addRoom(newRoom).subscribe({
        next: (data) => {
          this.onHideForm(data);
        },
        error: (error) => {
          this.onHideForm(
            null,
            'Room can not be added. Please try again later!'
          );
        },
      });
    }
  }

  onHideForm(roomData: Room = null, errorMsg: string = null) {
    const data = {
      room: roomData,
      errorMsg: errorMsg,
    };
    this.ngbActiveModal.close(data);
  }
}
