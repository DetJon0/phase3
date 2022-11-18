import { Pipe, PipeTransform } from '@angular/core';
import { AmenitiesEnum } from './shared.module';

@Pipe({
  name: 'displayAmenities',
})
export class DisplayAmenitiesPipe implements PipeTransform {
  transform(value: number): string {
    return Object.values(AmenitiesEnum)[value] as string;
    // switch (value) {
    //   case AmenitiesEnum.Parking:
    //     return 'Parking';
    //   case AmenitiesEnum.FreeWifi:
    //     return 'FreeWifi';
    //   case AmenitiesEnum.Pool:
    //     return 'Pool';
    //   case AmenitiesEnum.Fitness:
    //     return 'Fitness';
    //   case AmenitiesEnum.Security:
    //     return 'Security';
    //   case AmenitiesEnum.Elevators:
    //     return 'Elevators';
    //   case AmenitiesEnum.Terrace:
    //     return 'Terrace';
    //   default:
    //     return null;
    // }
  }
}
