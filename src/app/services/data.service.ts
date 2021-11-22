import { UpdateDoc } from './../components/documents/docs.interface';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private docSubject = new Subject<UpdateDoc>();
  private currentEditor = new Subject<string>();

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

  setCurrentEditor(currentEditor: string) {
    this.currentEditor.next(currentEditor);
  }

  getCurrentEditor() {
    return this.currentEditor.asObservable();
  }
}
