import { Injectable } from '@angular/core';
@Injectable()
export class LogService {
  log(msg: string | object | number) {
    console.log(new Date() + ': ' + JSON.stringify(msg));
  }
}
