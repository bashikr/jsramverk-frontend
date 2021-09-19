import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InternalConnectionService {
  private subject = new Subject<any>();
  private updateButtonSubject = new Subject<any>();
  private saveButtonVisible = new Subject<boolean>();
  private titleSubject = new Subject<any>();
  private contentSubject = new Subject<any>();
  private savedDocumentEvent = new Subject<any>();

  setUpdateButtonVisibility(bool:boolean) {
    this.saveButtonVisible.next(bool)
  }

  getUpdateButtonVisibility() {
    return this.saveButtonVisible.asObservable();
  }


  setClickSavedDocuments() {
    return this.savedDocumentEvent.next()
  }

  getClickSavedDocuments() {
    return this.savedDocumentEvent.asObservable();
  }


  sendClickEventUpdateButton() {
    this.updateButtonSubject.next();
  }

  getClickEventUpdateButton(): Observable<any> {
    return this.updateButtonSubject.asObservable();
  }


  sendClickEvent() {
    this.subject.next();
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }


  setUpdateContent(content:string) {
    this.contentSubject.next(content);
  }

  getUpdateContent() {
    return this.contentSubject.asObservable();
  }


  sendTitleInputValue(title: string) {
    this.titleSubject.next(title);
  }

  getTitleValue() {
    return this.titleSubject.asObservable();
  }
}
