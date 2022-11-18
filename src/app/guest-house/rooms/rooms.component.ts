import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faPencil,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Room } from 'src/app/shared/room.model';
import { RoomsService } from '../rooms.service';
import { EditRoomComponent } from './edit-room/edit-room.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  faPlus = faPlus;
  faPencil = faPencil;
  faTrashCan = faTrashCan;

  isLoading = false;
  errorMsg: string = null;

  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  ghName: string;
  ghId: number;

  editRoomModalRef: NgbModalRef;

  constructor(
    private roomsService: RoomsService,
    private route: ActivatedRoute,
    private ngbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.ghId = +this.route.snapshot.params['id'];
    this.ghName = this.route.snapshot.params['name'];
    this.route.params.subscribe((params) => {
      this.ghId = params['id'];
      this.ghName = params['name'];
    });

    this.fetchRooms();
  }
  private fetchRooms() {
    this.isLoading = true;
    this.roomsService.getRooms(this.ghId).subscribe({
      next: (roomsData) => {
        this.rooms = roomsData;

        this.filteredRooms = roomsData;
        this.isLoading = false;
        // console.log(this.rooms);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMsg = error.statusText;
        // console.log(error);
      },
    });
  }

  filterRooms(searchVal: string) {
    this.filteredRooms = this.rooms.filter((room) => {
      return (
        room.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        room.price.toString().includes(searchVal) ||
        room.numberOfBeds.toString().includes(searchVal)
      );
    });
    // console.log(searchVal);
  }

  onRemoveError() {
    this.errorMsg = null;
  }

  onNewRoom(roomData?: Room) {
    this.editRoomModalRef = this.ngbModal.open(EditRoomComponent, {
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });
    this.editRoomModalRef.componentInstance.ghId = this.ghId;
    if (roomData) {
      this.editRoomModalRef.componentInstance.roomData = roomData;
    }

    this.editRoomModalRef.result.then((data) => {
      if (data.errorMsg) {
        this.errorMsg = data.errorMsg;
        return;
      }

      if (roomData && data.room) {
        //edit
        this.rooms = this.rooms.map((tempRoom) => {
          if (tempRoom.id === data.room.id) {
            return data.room;
          }
          return tempRoom;
        });
      } else if (data.room) {
        //shto ne fund
        this.rooms.push(data.room);
      }

      this.filteredRooms = this.rooms;
    });
  }

  onDeleteRoom(roomData: Room) {
    const confirmModalRef: NgbModalRef = this.ngbModal.open(
      ConfirmDialogComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );
    confirmModalRef.componentInstance.message =
      'Are you sure you want to delete ' + roomData.name;
    confirmModalRef.result.then((choice) => {
      if (choice) {
        this.isLoading = true;
        this.roomsService.deleteRoom(roomData.id).subscribe({
          next: (data) => {
            this.rooms = this.rooms.filter(
              (ghTemp) => ghTemp.id !== roomData.id
            );

            this.filteredRooms = this.rooms;
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
}
