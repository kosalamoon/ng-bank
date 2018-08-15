import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'sentence'
})
export class SentenceCasePipe implements PipeTransform {


  transform(value: any, ...args: any[]): any {
    if (value != null) {
      return (value as string)
        .replace(/([A-Z])/g, (match) => ` ${match}`)
        .replace(/^./, (match) => match.toUpperCase());
    }
    return value;
  }

}
