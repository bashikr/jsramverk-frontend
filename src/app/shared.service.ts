import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private subject = new Subject<any>();
  private title: string = '';

  sendClickEvent() {
    this.subject.next();
  }

  sendTitleInputValue(title: string) {
    this.title = title;
  }

  getTitleValue() {
    return this.title;
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
