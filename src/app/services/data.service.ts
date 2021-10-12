import { UpdateDoc } from './../components/documents/docs.interface';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private docSubject = new Subject<UpdateDoc>();

  updateDocument(docObj: UpdateDoc) {
    this.docSubject.next({
      _id: docObj._id,
      title: docObj.title,
      content: docObj.content,
      updateDate: new Date(),
    });
  }

  updatedDocument() {
    return this.docSubject.asObservable();
  }
}
