import { UpdateDoc } from './../documents/docs.interface';
import { DataService } from '../../services/data.service';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { Component } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { BtnClicksService } from 'src/app/services/btnClicks.service';

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
    private btnClicksService: BtnClicksService
  ) {
    this.btnClicksService
      .updateBtnTglValue()
      .subscribe((res) => (this.isSave = res));
    this.documentsAPI.docByIdRes().subscribe((document) => {
      this.document.title = document.title;
      this.document._id = document._id;
    });
    this.btnClicksService.deleteBtnClick().subscribe(() => {
      this.document.title  = ''
      this.isSave = true
   });
  }

  onAddDocument(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.isSave === true) {
      this.dataService.sendTitle(form.value.title);
      this.btnClicksService.clickSaveBtn();
      this.document.title = '';
    } else if (this.isSave === false) {
      this.dataService.sendTitle(form.value.title);
      this.dataService.updatedContent().subscribe((content) => {
        this.document.content = content;
      });
      this.isSave = true;
      this.btnClicksService.clickUpdateBtn();
      this.documentsAPI.updateDocReq(this.document);
      this.document.title = '';
      this.dataService.initEditor('<p>Hello, world!</p>');
    }
  }

  fetchSavedDocuments() {
    if(this.toggleDocuments == false) {
      this.buttonName = 'Hide'
      this.toggleDocuments = true
      this.btnClicksService.clickDocsBtn(true);
      return this.documentsAPI.docsReq();
    }else {
      this.buttonName = 'Documents'
      this.toggleDocuments = false
      this.btnClicksService.clickDocsBtn(false);
    }
  }
}
