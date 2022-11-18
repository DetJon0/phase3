import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBed, faDollar, faStar } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RoomsService } from 'src/app/guest-house/rooms.service';
import { Room } from 'src/app/shared/room.model';
import { UserService } from '../../user.service';
import { BookingRoomComponent } from './booking-room/booking-room.component';

@Component({
  selector: 'app-rooms-cards',
  templateUrl: './rooms-cards.component.html',
  styleUrls: ['./rooms-cards.component.css'],
})
export class RoomsCardsComponent implements OnInit {
  rooms: Room[];

  ghId: number;
  ghName: string;
  checkIn: Date;
  checkOut: Date;
  numBeds: number;

  isLoading = false;
  errorMessage: string = null;

  modalRef: NgbModalRef;

  faBed = faBed;
  faStar = faStar;
  faDollar = faDollar;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private adminRoomsService: RoomsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.ghId = this.route.snapshot.params['id'];
    this.ghName = this.route.snapshot.params['name'];

    this.route.queryParams.subscribe((qParams) => {
      this.checkIn = new Date(qParams['checkIn']);
      this.checkOut = new Date(qParams['checkOut']);
      this.numBeds = qParams['numBeds'];

      this.isLoading = true;
      if (this.checkIn && this.checkOut && this.numBeds) {
        this.userService
          .getSearchRooms(this.ghId, this.checkIn, this.checkOut, this.numBeds)
          .subscribe({
            next: (rooms) => {
              // console.log(rooms);
              this.isLoading = false;
              this.rooms = rooms;
            },
            error: (error) => {
              // console.log(error);
              this.isLoading = false;
              this.errorMessage =
                'An error accrued while fetching data. PLease try again later.';
            },
          });
      } else {
        this.adminRoomsService.getRooms(this.ghId).subscribe({
          next: (rooms) => {
            // console.log(rooms);
            this.isLoading = false;
            this.rooms = rooms;
          },
          error: (error) => {
            // console.log(error);
            this.isLoading = false;
            this.errorMessage =
              'An error accrued while fetching data. PLease try again later.';
          },
        });
      }
    });
  }
  // ngAfterViewInit(): void {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'smooth',
  //   });
  // }

  onBookRoom(roomData: Room) {
    // duhet nje modal qe hap details per dhomen, dhe formen per me marr rezervimin
    //duhet dhoma si parameter
    this.modalRef = this.modalService.open(BookingRoomComponent, {
      centered: true,
      backdrop: 'static',
    });

    this.modalRef.componentInstance.roomData = roomData;
  }
}
