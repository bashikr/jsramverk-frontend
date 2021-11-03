import { Component } from '@angular/core';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { DisplayDoc } from './docs.interface';
import { BtnClicksService } from 'src/app/services/btnClicks.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { User } from './user.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documentsList.component.html',
  styleUrls: ['./documentsList.component.css'],
})
export class DocumentsComponent {
  public documents?: [DisplayDoc];
  public sharedDocuments?: DisplayDoc[];
  public users?: [User];
  public email?: string;
  public id: string = '';
  public returnUserRes!: string;

  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  public visibleDocs: boolean = false;

  constructor(
    private documentsAPI: DocumentsAPIService,
    private btnClicksService: BtnClicksService,
    private socketIoService: SocketIoService
  ) {
    this.documentsAPI.docsRes().subscribe((documents) => {
      this.documents = documents;
    });
    this.documentsAPI.sharedDocumentsRes().subscribe((documents) => {
      let res = documents.map((document: any) => {
        return document['docs'];
      });
      let arr = [];

      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].length; j++) {
          if (Object.keys(res[i][j]).includes('allowed_users')) {
            arr.push(res[i][j]);
          }
        }
      }

      this.sharedDocuments = arr;
    });
    this.documentsAPI.usersRes().subscribe((users) => {
      this.users = users;
    });
    this.btnClicksService.docsBtnClick().subscribe((bool) => {
      this.visibleDocs = bool;
      return this.visibleDocs;
    });
  }

  public deleteDocument(id: string) {
    this.documentsAPI.deleteDocReq(id).subscribe(() => {});
    this.btnClicksService.clickDocsBtn(true);

    this.documents?.forEach((document, index) => {
      if (document._id === id) this.documents?.splice(index, 1);
    });
    this.btnClicksService.clickDeleteBtn();
  }

  public updateDocument(id: string) {
    this.socketIoService.emit('openDoc', id);

    this.btnClicksService.tglUpdateBtn(false);
    return this.documentsAPI.docByIdReq(id);
  }

  getId(id: string) {
    this.id = id;
  }

  public addUser(usersForm: NgForm) {
    if (usersForm.invalid) {
      return;
    }

    if (usersForm.value.email !== undefined) {
      this.documentsAPI.allowUserReq({
        email: usersForm.value.email,
        id: this.id,
      });
      this.returnUserRes = 'Done';
    } else {
      this.returnUserRes = 'Choose a user first!';
    }
  }
}
