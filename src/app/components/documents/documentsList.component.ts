import { Component } from '@angular/core';
import { InternalConnectionService } from 'src/app/components/services/internalConnection.service';
import { DocumentsAPIService } from '../services/documents.api.service';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { DisplayDoc } from './docs.interface';
DocumentsAPIService;
@Component({
  selector: 'app-documents-list',
  templateUrl: './documentsList.component.html',
  styleUrls: ['./documentsList.component.css'],
})
export class DocumentsComponent {
  public documents?: [DisplayDoc];
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  constructor(
    private sharedService: InternalConnectionService,
    private documentsAPI: DocumentsAPIService
  ) {
    this.documentsAPI.getDocumentsResponse().subscribe((documents) => {
      this.documents = documents;
      return this.documents;
    });
  }

  public deleteDocument(id: string) {
    this.documentsAPI.deleteDocumentRequest(id).subscribe(() => {});
    this.sharedService.setUpdateButtonVisibility(true);

    this.documents?.forEach((document, index) => {
      if (document._id === id) this.documents?.splice(index, 1);
    });
  }

  public updateDocument(id: string) {
    this.sharedService.setUpdateButtonVisibility(false);
    return this.documentsAPI.getDocumentByIdRequest(id);
  }
}
