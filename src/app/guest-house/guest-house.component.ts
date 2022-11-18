import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faHouseChimney,
  faPencil,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { GuestHouse } from '../shared/guestHouse.model';
import { EditGuestHouseComponent } from './edit-guest-house/edit-guest-house.component';
import { RoomsService } from './rooms.service';

@Component({
  selector: 'app-guest-house',
  templateUrl: './guest-house.component.html',
  styleUrls: ['./guest-house.component.css'],
})
export class GuestHouseComponent implements OnInit {
  faPlus = faPlus;
  faPencil = faPencil;
  faTrashCan = faTrashCan;
  faHouse = faHouseChimney;

  isLoading = false;
  errorMsg = null;

  guestHouses: GuestHouse[] = [];
  filteredGuestHouses: GuestHouse[] = [];

  modalRef: NgbModalRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roomsService: RoomsService,
    private ngbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData() {
    this.isLoading = true;
    this.roomsService.getGuestHouses().subscribe({
      next: (data) => {
        this.guestHouses = data;
        this.filteredGuestHouses = data;
        this.isLoading = false;
        // console.log(this.guestHouses);
      },
      error: (error) => {
        this.isLoading = false;
        // console.log(error);
        this.errorMsg = error.statusText;
      },
    });
  }

  onNewGuestHouse(guestHouse?: GuestHouse) {
    this.modalRef = this.ngbModal.open(EditGuestHouseComponent, {
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    this.modalRef.componentInstance.guestHouseData = guestHouse;

    this.modalRef.result.then((data) => {
      if (data.errorMsg) {
        this.errorMsg = data.errorMsg;
        return;
      }

      // console.log('inside the promise',data);
      if (guestHouse && data.ghData) {
        //edit
        this.guestHouses = this.guestHouses.map((gh) => {
          if (gh.id === data.ghData.id) {
            return data.ghData;
          }
          return gh;
        });
      } else if (data.ghData) {
        //add
        this.guestHouses.push(data.ghData);
      }

      this.filteredGuestHouses = this.guestHouses;
    });
  }

  onDeleteGH(ghData: GuestHouse) {
    const confirmModalRef: NgbModalRef = this.ngbModal.open(
      ConfirmDialogComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );
    confirmModalRef.componentInstance.message =
      'Are you sure you want to delete ' + ghData.name;
    confirmModalRef.result.then((choice) => {
      if (choice) {
        this.isLoading = true;
        this.roomsService.deleteGuestHouse(ghData.id).subscribe({
          next: (data) => {
            this.guestHouses = this.guestHouses.filter(
              (ghTemp) => ghTemp.id !== ghData.id
            );

            this.filteredGuestHouses = this.guestHouses;
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMsg =
              'Unable to delete the element. Please try again later.';
            this.isLoading = false;
            // console.log(error);
          },
        });
      }
    });
  }

  goToRooms(ghData: GuestHouse) {
    this.router.navigate(['rooms', ghData.id, ghData.name], {
      relativeTo: this.route,
    });
  }

  filterGuestHouses(searchVal: string) {
    this.filteredGuestHouses = this.guestHouses.filter((guestHouse) => {
      return (
        guestHouse.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        guestHouse.description.toLowerCase().includes(searchVal.toLowerCase())
      );
    });
    // console.log(searchVal);
  }

  onRemoveError() {
    this.errorMsg = null;
  }
}
