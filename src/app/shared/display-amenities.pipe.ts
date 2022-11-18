import { Pipe, PipeTransform } from '@angular/core';
import { AmenitiesEnum } from './shared.module';

@Pipe({
  name: 'displayAmenities',
})
export class DisplayAmenitiesPipe implements PipeTransform {
  transform(value: number): string {
    return Object.values(AmenitiesEnum)[value] as string;
  }
}
