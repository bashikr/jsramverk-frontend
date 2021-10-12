import { Component } from '@angular/core';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { DisplayDoc } from './docs.interface';
import { BtnClicksService } from 'src/app/services/btnClicks.service';
import { SocketIoService } from 'src/app/services/socket.io.service';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documentsList.component.html',
  styleUrls: ['./documentsList.component.css'],
})
export class DocumentsComponent {
  public documents?: [DisplayDoc];
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
}
