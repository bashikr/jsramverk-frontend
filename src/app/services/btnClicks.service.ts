import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BtnClicksService {
  private saveButtonSubject = new Subject<BtnClicksService>();
  private updateButtonSubject = new Subject<BtnClicksService>();
  private deleteButtonSubject = new Subject<BtnClicksService>();
  private documentsButtonSubject = new Subject<boolean>();

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

  updateBtnClick(): Observable<BtnClicksService> {
    return this.updateButtonSubject.asObservable();
  }



  clickDeleteBtn() {
    this.deleteButtonSubject.next();
  }

  deleteBtnClick(): Observable<BtnClicksService> {
    return this.deleteButtonSubject.asObservable();
  }



  clickDocsBtn(bool:boolean) {
    this.documentsButtonSubject.next(bool);
  }

  docsBtnClick(): Observable<boolean> {
    return this.documentsButtonSubject.asObservable();
  }



  clickSaveBtn() {
    this.saveButtonSubject.next();
  }

  saveBtnClick(): Observable<BtnClicksService> {
    return this.saveButtonSubject.asObservable();
  }
}
