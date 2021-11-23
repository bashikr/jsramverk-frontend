import { shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CreateDoc, UpdateDoc } from '../components/documents/docs.interface';
import { InviteUser } from '../components/documents/user.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentsAPIService {
  private documentsSubject = new Subject<any>();
  private documentSubject = new Subject<any>();
  private usersSubject = new Subject<any>();
  private userSubject = new Subject<any>();
  private sharedDocuments = new Subject<any>();
  readonly baseURL: string;
  private LOCAL_DOMAINS: Array<string> = ['localhost', '127.0.0.1'];

  constructor(public http: HttpClient) {
    if (this.LOCAL_DOMAINS.includes(window.location.hostname)) {
      this.baseURL = 'http://localhost:1337/';
    } else {
      this.baseURL =
        'https://jsramverk-angular-editor-baaa19.azurewebsites.net/';
    }
  }

  createDocReq(document: CreateDoc) {
    return this.http
      .post(this.baseURL + 'documents/create-doc', document).pipe(
        shareReplay(1)
    );
  }

  compileCodeReq(data: object) {
    return this.http
      .post('https://execjs.emilfolino.se/code', data).pipe(
        shareReplay(1)
    )
  }

  docsReq() {
    return this.http
      .post(
        this.baseURL + 'graphql',
        {
          query:
            '\n' +
            '{\n' +
            '  user {\n' +
            '    docs {\n' +
            '      _id,\n' +
            '      title,\n' +
            '      content,\n' +
            '      docType,\n' +
            '      creationDate,\n' +
            '      updateDate,\n' +
            '      allowed_users\n' +
            '    }\n' +
            '\t}\n' +
            '}',
        },
        {
          observe: 'response',
        }
      )
      .subscribe((res: any) => {
        return this.documentsSubject.next(res.body.data.user.docs);
      });
  }

  docsRes() {
    return this.documentsSubject.asObservable();
  }

  usersReq() {
    return this.http
      .post(this.baseURL + 'documents/users', { observe: 'response' })
      .subscribe((res: any) => {
        return this.usersSubject.next(res);
      });
  }

  usersRes() {
    return this.usersSubject.asObservable();
  }

  sendCollaborationInvite(inviteUser: InviteUser) {
    return this.http
      .post(this.baseURL + 'collaboration-invite', inviteUser, {
        observe: 'response',
      })
      .subscribe((res: any) => {
        return this.userSubject.next(res);
      });
  }

  sendCollaborationInviteRes() {
    return this.userSubject.asObservable();
  }

  sharedDocumentsReq() {
    return this.http
      .post(this.baseURL + 'documents/shared-documents', {
        observe: 'response',
      })
      .subscribe((res: any) => {
        return this.sharedDocuments.next(res);
      });
  }

  sharedDocumentsRes() {
    return this.sharedDocuments.asObservable();
  }

  docByIdReq(id: string) {
    return this.http
      .get(this.baseURL + 'documents/' + id, {
        observe: 'response',
      })
      .subscribe((res: any) => {
        return this.documentSubject.next(res.body);
      });
  }

  docByIdRes() {
    return this.documentSubject.asObservable();
  }

  updateDocReq(document: UpdateDoc) {
    this.http.put(this.baseURL + 'documents/update-doc', document).subscribe();
  }

  updateSharedDocReq(document: UpdateDoc) {
    this.http
      .put(this.baseURL + 'documents/modify-shared-documents', document)
      .subscribe();
  }

  deleteDocReq(id: string) {
    return this.http.delete(this.baseURL + 'documents/delete-doc/' + id);
  }
}
