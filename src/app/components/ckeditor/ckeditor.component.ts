import { UpdateDoc } from './../documents/docs.interface';
import { DataService } from '../../services/data.service';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { BtnClicksService } from 'src/app/services/btnClicks.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.css'],
})
export class CKEditorComponent implements OnInit {
  public Editor = DecoupledEditor;

  public model: UpdateDoc = {
    _id: '',
    title: 'undefined',
    content: '<p>Hello, world!</p>',
  };

  setValue(document: UpdateDoc) {
    this.model._id = document._id;
    this.model.content = document.content;
    this.model.title = document.title;
  }

  constructor(
    private dataService: DataService,
    private documentsAPI: DocumentsAPIService,
    private btnClicksService: BtnClicksService,
    private socketIoService: SocketIoService
  ) {
    this.btnClicksService.saveBtnClick().subscribe(() => {
      this.documentsAPI.createDocReq({
        title: this.model.title,
        content: this.model.content,
      });
      this.model.content = '<p>Hello, world!</p>';
    });

    this.dataService.updatedDocument().subscribe((document) => {
      this.model.title = document.title;
      this.model.content = document.content;
    });

    this.documentsAPI.docByIdRes().subscribe((object) => {
      this.setValue(object);
    });

    this.btnClicksService.updateBtnClick().subscribe(() => {
      this.model.content = '<p>Hello, world!</p>';
    });

    this.btnClicksService.deleteBtnClick().subscribe(() => {
      this.model.content = '<p>Hello, world!</p>';
    });
  }

  public onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  public onKeyUp(event: KeyboardEvent) {
    event.preventDefault();

    this.socketIoService.listen('updateContent').subscribe((obj: any) => {
      this.model.content = obj.content;
    });

    this.dataService.updateDocument({
      _id: this.model._id,
      content: this.model.content,
      title: this.model.title,
    });

    this.socketIoService.emit('updateDocument', this.model);
  }

  ngOnInit() {
    this.socketIoService
      .listen('updateDocument')
      .subscribe((doc: UpdateDoc) => {
        this.socketIoService.emit('updateContent', {
          id: doc._id,
          content: this.model.content,
        });
        if (doc._id == this.model._id) {
          this.model.content = doc.content;
        }
        setTimeout(() => {
          this.documentsAPI.updateDocReq(this.model);
          this.documentsAPI.updateSharedDocReq(this.model);
        }, 2000);
      });
  }
}
