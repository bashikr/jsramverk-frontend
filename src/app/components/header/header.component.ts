import { UpdateDoc } from './../documents/docs.interface';
import { DataService } from '../../services/data.service';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { Component } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { BtnClicksService } from 'src/app/services/btnClicks.service';
import { SocketIoService } from 'src/app/services/socket.io.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  faFileAlt = faFileAlt;
  public isSave: boolean = true;
  public toggleDocuments: boolean = false;
  public buttonName: string = 'Documents';

  public document: UpdateDoc = {
    _id: '',
    title: '',
    content: '',
    updateDate: new Date(),
  };

  constructor(
    private dataService: DataService,
    private documentsAPI: DocumentsAPIService,
    private btnClicksService: BtnClicksService,
    private socketIoService: SocketIoService
  ) {
    this.btnClicksService
      .updateBtnTglValue()
      .subscribe((res) => (this.isSave = res));
    this.documentsAPI.docByIdRes().subscribe((document) => {
      this.document.title = document.title;
      this.document._id = document._id;
      this.document.content = document.content;
    });
    this.btnClicksService.deleteBtnClick().subscribe(() => {
      this.document.title = '';
      this.isSave = true;
    });
    this.dataService.updatedDocument().subscribe((document) => {
      this.document.content = document.content;
    });
  }

  onAddDocument(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.isSave === true) {
      this.dataService.updateDocument({
        _id: this.document._id,
        title: form.value.title,
        content: this.document.content,
      });
      this.btnClicksService.clickSaveBtn();
      this.document.title = '';
    } else if (this.isSave === false) {
      this.dataService.updateDocument({
        _id: this.document._id,
        content: this.document.content,
        title: form.value.title,
      });

      this.isSave = true;
      this.socketIoService.emit('closeDoc', this.document._id);

      this.btnClicksService.clickUpdateBtn();
      this.documentsAPI.updateDocReq(this.document);
      this.document.title = '';
    }
  }

  fetchSavedDocuments() {
    if (this.toggleDocuments == false) {
      this.buttonName = 'Hide';
      this.toggleDocuments = true;
      this.documentsAPI.docsReq();
      this.btnClicksService.clickDocsBtn(true);
    } else {
      this.buttonName = 'Documents';
      this.toggleDocuments = false;
      this.btnClicksService.clickDocsBtn(false);
    }
  }
}
