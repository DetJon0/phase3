import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { GuestHouse } from '../shared/guestHouse.model';
import { UserData, UserDataResponse } from '../shared/models/user.model';
import { BookingModel } from '../shared/models/booking.model';
import { RoomsService } from '../guest-house/rooms.service';
import { Room } from '../shared/room.model';

export interface ghWithImg {
  id: number;
  name: string;
  description: string;
  img: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userProfileData = new BehaviorSubject<UserDataResponse>(null);
  userBookingsData = new BehaviorSubject<BookingModel[]>(null);

  constructor(
    private http: HttpClient,
    private adminRoomsService: RoomsService
  ) {}

  getAllGuestHouses(): Observable<ghWithImg[]> {
    return this.adminRoomsService.getGuestHouses().pipe(
      map((ghs) => {
        return ghs.map((gh) => {
          return {
            ...gh,
            img: `f${Math.floor(Math.random() * 3 + 1)}.jpg`,
          };
        });
      })
    );
  }

  /**
   * @param checkIn-check-in date
   * @param checkOut-check-out date
   * @param numberOfBeds - number of beds you want in room
   *
   * (from when to when rooms to be free and the number og beds you desire)
   *
   * @return ghs with these criteria
   */
  getSearchGuestHouse(
    checkIn: Date,
    checkOut: Date,
    numberOfBeds: number
  ): Observable<ghWithImg[]> {
    let newParams = new HttpParams();

    // newParams = newParams.append('checkIn', Date.parse(checkIn.toString()));
    // newParams = newParams.append('checkOut', checkOut.toString());
    // newParams = newParams.append('checkIn', this.dateFormat(checkIn));
    // newParams = newParams.append('checkOut', this.dateFormat(checkOut));

    newParams = newParams.append('checkIn', checkIn.toJSON());
    newParams = newParams.append('checkOut', checkOut.toJSON());

    newParams = newParams.append('numberOfBeds', numberOfBeds);

    // console.log(newParams, checkIn instanceof Date, checkOut, numberOfBeds);

    return this.http
      .get<GuestHouse[]>(environment.API_CALLS_LINK + '/GuestHouse', {
        params: newParams, //parametrat qe i duhen per kerkimin
      })
      .pipe(
        map((ghs) => {
          return ghs.map((gh) => {
            return {
              ...gh,
              img: `f${Math.floor(Math.random() * 3 + 1)}.jpg`,
            };
          });
        })
      );
  }
  dateFormat(date: Date): string {
    //2022-11-04T10:10:42.562Z
    // console.log(
    //   `${date.getFullYear()}-${this.make2digit(
    //     date.getMonth() + 1
    //   )}-${this.make2digit(date.getDate())}T${this.make2digit(
    //     date.getHours()
    //   )}:${this.make2digit(date.getMinutes())}:${this.make2digit(
    //     date.getSeconds()
    //   )}.${date.getMilliseconds()}Z`
    // );

    return `${date.getFullYear()}-${this.make2digit(
      date.getMonth() + 1
    )}-${this.make2digit(date.getDate())}T${this.make2digit(
      date.getHours()
    )}:${this.make2digit(date.getMinutes())}:${this.make2digit(
      date.getSeconds()
    )}.${date.getMilliseconds()}Z`;
  }
  make2digit(num: number) {
    return num <= 9 ? '0' + num : '' + num;
  }

  /**
   * returns top 5 guestHouses and adds an random img from assets folder
   */
  getTop5gh(): Observable<ghWithImg[]> {
    return this.http
      .get<GuestHouse[]>(environment.API_CALLS_LINK + '/GuestHouse/top-five')
      .pipe(
        map((ghs) => {
          return ghs.map((gh) => {
            return {
              id: gh.id,
              name: gh.name,
              description: gh.description,
              img: `f${Math.floor(Math.random() * 3 + 1)}.jpg`,
            };
          });
        })
      );
  }

  /**
   * @param bookData - booking data: booking-id, roomId,date checkIn/Out
   *
   * @return
   */
  bookRoom(bookData: BookingModel) {
    return this.http.post(environment.API_CALLS_LINK + '/Room/book', bookData);
  }

  /**
   * @param id-user id
   * @return array of bookingModel for that user ---PROBLEM if BE doesn't give us room data...
   * than i need to make e second call for all the rooms , or separate calls for each room
   * When displaying booking info (I NEED ROOM NAME) ---
   */
  getUserBookings(id: string): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(
      environment.API_CALLS_LINK + '/Bookings/user/' + id
    );
  }

  /**
   * @param id-user id
   * @return user data- username,email,firstName, LastName, phoneNumber
   */
  getUserData(id: string): Observable<UserDataResponse> {
    return this.http.get<UserDataResponse>(
      environment.API_CALLS_LINK + '/Users/' + id
    );
    // .pipe(
    //   map((user) => {
    //     return {
    //       username: user.userName,
    //       email: user.email,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       phoneNumber: user.phoneNumber,
    //     };
    //   })
    // );
  }

  editUser(userData: UserDataResponse): Observable<UserDataResponse> {
    return this.http.put<UserDataResponse>(
      environment.API_CALLS_LINK + '/Users/' + userData.id,
      userData
    );
  }

  /**
   * @param id - roomId you want the booking data
   *
   * @return array of booking dates for the particular room
   * needed to disable the dates that this room is booked
   */
  getRoomBookedDates(id: number): Observable<Date[]> {
    return this.http
      .get<BookingModel[]>(environment.API_CALLS_LINK + '/Bookings/' + id)
      .pipe(
        map((bookedDates) => {
          const datesArr: Date[] = [];
          bookedDates.forEach((bookedDate) => {
            datesArr.push(
              ...this.daysBetween(
                new Date(bookedDate.bookFrom),
                new Date(bookedDate.bookTo)
              )
            );
          });
          return datesArr;
        })
      );
  }

  private daysBetween(d1: Date, d2: Date): Date[] {
    // console.log(d1);
    const dateArr: Date[] = [];
    for (
      let date = d1;
      date.getDate() <= d2.getDate();
      date.setDate(date.getDate() + 1)
    ) {
      dateArr.push(new Date(date));
    }
    return dateArr;
  }

  //---

  // getUsers(): Observable<UserData> {
  //   return this.http
  //     .get<UserDataResponse>(environment.API_CALLS_LINK + '/Users')
  //     .pipe(
  //       map((user) => {
  //         return {
  //           username: user.userName,
  //           email: user.email,
  //           firstName: user.firstName,
  //           lastName: user.lastName,
  //           phoneNumber: user.phoneNumber,
  //         };
  //       })
  //     );
  // }

  getUsers(): Observable<UserData[]> {
    return this.http
      .get<UserDataResponse[]>(environment.API_CALLS_LINK + '/Users')
      .pipe(
        map((users) => {
          return users.map((user) => {
            return {
              username: user.userName,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
            };
          });
        })
      );
  }

  getSearchRooms(
    ghId: number,
    checkIn: Date,
    checkOut: Date,
    numberOfBeds: number
  ): Observable<Room[]> {
    let newParams = new HttpParams();

    // newParams = newParams.append('checkIn', Date.parse(checkIn.toString()));
    // newParams = newParams.append('checkOut', checkOut.toString());
    // newParams = newParams.append('checkIn', this.dateFormat(checkIn));
    // newParams = newParams.append('checkOut', this.dateFormat(checkOut));

    newParams = newParams.append('checkIn', checkIn.toJSON());
    newParams = newParams.append('checkOut', checkOut.toJSON());

    // newParams = newParams.append('numberOfBeds', numberOfBeds);

    console.log(newParams, checkIn instanceof Date, checkOut, numberOfBeds);

    return this.http.get<Room[]>(
      environment.API_CALLS_LINK + '/Room/GuestHouse/' + ghId,
      {
        params: newParams, //parametrat qe i duhen per kerkimin
      }
    );
  }
}
