import { UpdateDoc } from './../documents/docs.interface';
import { InternalConnectionService } from '../services/internalConnection.service';
import { DocumentsAPIService } from '../services/documents.api.service';
import { Component } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  faFileAlt = faFileAlt;
  public isSave: boolean = true;

  public document: UpdateDoc = {
    _id: '',
    title: '',
    content: '',
    updateDate: new Date(),
  };

  constructor(
    private sharedService: InternalConnectionService,
    private documentsAPI: DocumentsAPIService
  ) {
    this.sharedService
      .getUpdateButtonVisibility()
      .subscribe((res) => (this.isSave = res));
    this.documentsAPI.getDocumentByIdResponse().subscribe((document) => {
      this.document.title = document[0].title;
      this.document._id = document[0]._id;
    });
  }

  onAddDocument(form: NgForm) {
    if (this.isSave === true) {
      if (form.invalid) {
        return;
      }
      this.sharedService.sendTitleInputValue(form.value.title);
      this.sharedService.sendClickEvent();
      this.document.title = '';
      this.sharedService.setUpdateContent('');
    } else if (this.isSave === false) {
      this.sharedService.sendTitleInputValue(form.value.title);
      this.sharedService.getUpdateContent().subscribe((content) => {
        this.document.content = content;
      });
      this.isSave = true;
      this.sharedService.sendClickEventUpdateButton();
      this.documentsAPI.updateDocumentRequest(this.document);
      this.document.title = '';
    }
  }

  fetchSavedDocuments() {
    return this.documentsAPI.getDocumentsRequest();
  }
}
