import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "time"
})
export class TimePipe implements PipeTransform {

  transform(value: any): any {
    if (value != null) {
      let number = Number.parseInt((value as string).slice(0, 2));
      if (number > 12) {
        number = number - 12;
        if (number < 10)
          return "0" + number.toString() + (value as string).slice(2) + " PM";
        else
          return number.toString() + (value as string).slice(2) + " PM";
      }
      return value + " AM";
    }
  }

}
