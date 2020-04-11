import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "friendlyDate",
})
export class FriendlyDatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const date = new Date(value);
    return date.toLocaleDateString();
  }
}
