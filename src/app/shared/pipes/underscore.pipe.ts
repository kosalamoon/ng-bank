import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'underscore'
})
export class UnderscorePipe implements PipeTransform {


  transform(value: any): any {
    if (value != null) {
      if ((value as string).indexOf('_') !== -1) {
        // language=JSRegexp
        return (value as string).replace(/_/g, ' ');
      }
    }
    return value;
  }

}
