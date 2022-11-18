import { Room } from '../room.model';

export interface BookingModel {
  id?: number;
  roomId: number;
  bookFrom: Date;
  bookTo: Date;
  room?: Room;
}
