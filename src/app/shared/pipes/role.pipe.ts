import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {


  transform(value: any, ...args: any[]): any {
    if (value != null) {
      return (value as string).slice(5);
    }
    return value;
  }

}
