import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private titleSubject = new Subject<any>();
  private contentSubject = new Subject<any>();
  private editorSubject = new Subject<any>();

  initEditor(str:string) {
    this.editorSubject.next(str);
  }

  editorInitValue() {
    return this.editorSubject.asObservable();
  }



  updateContent(content:string) {
    this.contentSubject.next(content);
  }

  updatedContent() {
    return this.contentSubject.asObservable();
  }



  sendTitle(title: string) {
    this.titleSubject.next(title);
  }

  getTitle() {
    return this.titleSubject.asObservable();
  }
}
