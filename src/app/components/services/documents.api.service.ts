import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CreateDoc, UpdateDoc } from '../documents/docs.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentsAPIService {
  private documentsSubject = new Subject<any>();
  private documentSubject = new Subject<any>();

  readonly baseURL = 'https://jsramverk-angular-editor-baaa19.azurewebsites.net/';
  constructor(public http: HttpClient) {}

  setDocumentsRequest(document: CreateDoc) {
    this.http.post(this.baseURL + 'documents/create-doc', document).subscribe();
  }

  getDocumentsRequest() {
    this.http.get(this.baseURL + 'documents').subscribe((res) => {
      return this.documentsSubject.next(res);
    });
  }

  getDocumentsResponse() {
    return this.documentsSubject.asObservable();
  }


  getDocumentByIdRequest(id: string) {
    return this.http.get(this.baseURL + 'documents/' + id).subscribe((res) => {
      return this.documentSubject.next(res);
    });
  }

  getDocumentByIdResponse() {
    return this.documentSubject.asObservable();
  }


  updateDocumentRequest(document: UpdateDoc) {
    this.http.put(this.baseURL + 'documents/update-doc', document).subscribe();
  }

  deleteDocumentRequest(id: string) {
    return this.http.delete(this.baseURL + 'documents/delete-doc/' + id);
  }
}
