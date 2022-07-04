import { Pipe, PipeTransform } from '@angular/core';
import { MasiniComponent } from './masini.component';

@Pipe({
  name: 'filterCar',
})
export class FilterPipe implements PipeTransform {
  transform(cars: MasiniComponent['cars'], filterText: string) {
    if (cars.length === 0 || filterText === '') {
      return cars;
    } else {
      return cars.filter((car: { marca: string }) => {
        return car.marca.toLowerCase() === filterText.toLowerCase();
      });
    }
  }
}
