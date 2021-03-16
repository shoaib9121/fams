import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeSpace' })
export class RemoveSpacePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value["en"].replace(/ /g, "_").toLowerCase();
  }
}