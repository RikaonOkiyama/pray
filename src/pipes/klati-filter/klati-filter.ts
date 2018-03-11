import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the KlatiFilterPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'klatiFilterPipe',
})
export class KlatiFilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return value.toLowerCase();
  }
}

@Pipe({name: 'toArray'})
export class ToArrayPipe implements PipeTransform {
  transform(inputObj: any, arg: any) {
    if (!inputObj) { return [] }

    let arr = [];
    for(let key in inputObj) {
      // Option1 (only value without the json object's key)
      // this way will lose the key of Json Object
      //arr.push(inputObj[key]);

      // OPtion2 (both the key and value)
      //let obj = {};
      //obj[key] = inputObj[key];
      //arr.push(obj);

      //Options3 (key and value)
      //let obj = {};
      inputObj[key].key = key;
      arr.push(inputObj[key]);
    }
    return arr;
  }
}
