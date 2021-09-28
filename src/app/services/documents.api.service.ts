import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CreateDoc, UpdateDoc } from '../components/documents/docs.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentsAPIService {
  private documentsSubject = new Subject<any>();
  private documentSubject = new Subject<any>();
  readonly baseURL:string;
  private LOCAL_DOMAINS:Array<string> = ['localhost', '127.0.0.1']

  constructor(public http: HttpClient) {
    if (this.LOCAL_DOMAINS.includes(window.location.hostname)) {
      this.baseURL = 'http://localhost:1337/'
    } else {
      this.baseURL = 'https://jsramverk-angular-editor-baaa19.azurewebsites.net/'
    }
  }

  createDocReq(document: CreateDoc) {
    this.http.post(this.baseURL + 'documents/create-doc', document).subscribe();
  }

  docsReq() {
    this.http.get(this.baseURL + 'documents').subscribe((res) => {
      return this.documentsSubject.next(res);
    });
  }

  docsRes() {
    return this.documentsSubject.asObservable();
  }


  docByIdReq(id: string) {
    return this.http.get(this.baseURL + 'documents/' + id).subscribe((res) => {
      return this.documentSubject.next(res);
    });
  }

  docByIdRes() {
    return this.documentSubject.asObservable();
  }


  updateDocReq(document: UpdateDoc) {
    this.http.put(this.baseURL + 'documents/update-doc', document).subscribe();
  }

  deleteDocReq(id: string) {
    return this.http.delete(this.baseURL + 'documents/delete-doc/' + id);
  }
}
