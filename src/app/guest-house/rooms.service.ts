import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { GuestHouse } from '../shared/guestHouse.model';
import { Room } from '../shared/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @returns an observable, when you subscribe gives an array of guestHouses
   */
  getGuestHouses(): Observable<GuestHouse[]> {
    return this.http.get<GuestHouse[]>(
      environment.API_CALLS_LINK + '/GuestHouse'
    );
  }
  /**
   *
   * @param id id of the guestHouse
   * @returns observable, when you subscribe it returns the data if the guestHouse with that id
   */
  getGuestHouse(id: number): Observable<GuestHouse> {
    return this.http.get<GuestHouse>(
      environment.API_CALLS_LINK + '/GuestHouse/' + id
    );
  }

  /**
   *
   * @param newGh newGh - the new guestHouse object
   * @returns observable when you subscribe adds, and returns that new guestHouse
   */
  addGuestHouse(newGh: GuestHouse): Observable<GuestHouse> {
    // console.log(newGh)
    return this.http.post<GuestHouse>(
      environment.API_CALLS_LINK + '/GuestHouse',
      newGh
    );
  }
  /**
   *
   * @param modifiedGh  modifiedGh - the modified guestHouse object
   * @returns observable when you subscribe overwrites and returns this modified guestHouse
   */
  editGuestHouse(modifiedGh: GuestHouse): Observable<GuestHouse> {
    // console.log(modifiedGh)
    return this.http.put<GuestHouse>(
      environment.API_CALLS_LINK + '/GuestHouse/' + modifiedGh.id,
      modifiedGh
    );
  }
  /**
   *
   * @param id id of the guestHouse you want to delete, and it returns void
   */
  deleteGuestHouse(id: number) {
    return this.http.delete<GuestHouse>(
      environment.API_CALLS_LINK + '/GuestHouse/' + id
    );
  }

  /** Rooms function */

  getRooms(ghId: number): Observable<Room[]> {
    return this.http.get<Room[]>(
      environment.API_CALLS_LINK + '/Room/GuestHouse/' + ghId
    );
  }
  getRoom(roomId: number): Observable<Room> {
    return this.http.get<Room>(environment.API_CALLS_LINK + '/Room/' + roomId);
  }

  addRoom(newRoom: Room): Observable<Room> {
    return this.http.post<Room>(environment.API_CALLS_LINK + '/Room', newRoom);
  }
  editRoom(modifiedRoom: Room): Observable<Room> {
    return this.http.put<Room>(
      environment.API_CALLS_LINK + '/Room/' + modifiedRoom.id,
      modifiedRoom
    );
  }

  deleteRoom(roomId: number) {
    return this.http.delete(environment.API_CALLS_LINK + '/Room/' + roomId);
  }
}
