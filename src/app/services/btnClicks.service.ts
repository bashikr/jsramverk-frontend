import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BtnClicksService {
  private saveButtonSubject = new Subject<any>();
  private updateButtonSubject = new Subject<any>();
  private deleteButtonSubject = new Subject<any>();
  private documentsButtonSubject = new Subject<any>();

  private saveButtonVisible = new Subject<boolean>();

  tglUpdateBtn(bool:boolean) {
    this.saveButtonVisible.next(bool)
  }

  updateBtnTglValue() {
    return this.saveButtonVisible.asObservable();
  }



  clickUpdateBtn() {
    this.updateButtonSubject.next();
  }

  updateBtnClick(): Observable<any> {
    return this.updateButtonSubject.asObservable();
  }



  clickDeleteBtn() {
    this.deleteButtonSubject.next();
  }

  deleteBtnClick(): Observable<any> {
    return this.deleteButtonSubject.asObservable();
  }



  clickDocsBtn(bool:boolean) {
    this.documentsButtonSubject.next(bool);
  }

  docsBtnClick(): Observable<any> {
    return this.documentsButtonSubject.asObservable();
  }



  clickSaveBtn() {
    this.saveButtonSubject.next();
  }

  saveBtnClick(): Observable<any> {
    return this.saveButtonSubject.asObservable();
  }
}
