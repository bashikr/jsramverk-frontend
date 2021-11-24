import { Subscription } from 'rxjs';
import { UpdateDoc } from './../documents/docs.interface';
import { DataService } from '../../services/data.service';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { BtnClicksService } from 'src/app/services/btnClicks.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.css'],
})
export class CKEditorComponent implements OnInit, OnDestroy {
  public Editor = DecoupledEditor;
  clickSubscriber: Subscription;
  createDocUnsubscribe!: Subscription;
  currentURIUnsubscribe!: Subscription;

  public model: UpdateDoc = {
    _id: '',
    title: 'undefined',
    docType: 'text',
    content: '<p>Hello, world!</p>',
  };

  setValue(document: UpdateDoc) {
    this.model._id = document._id;
    this.model.content = document.content;
    this.model.title = document.title;
    this.model.docType = 'text';
  }

  constructor(
    private dataService: DataService,
    private documentsAPI: DocumentsAPIService,
    private btnClicksService: BtnClicksService,
    private socketIoService: SocketIoService
  ) {
    this.dataService.updatedDocument().subscribe((document) => {
      this.model.title = document.title;
      this.model.content = document.content;
      this.model.docType = 'text';
    });

    this.clickSubscriber = this.btnClicksService
      .saveBtnClick()
      .subscribe(() => {
        if (this.currentURIUnsubscribe) {
          this.currentURIUnsubscribe.unsubscribe();
        }
        this.currentURIUnsubscribe = this.dataService
          .getCurrentEditor()
          .subscribe((res) => {
            if (this.createDocUnsubscribe) {
              this.createDocUnsubscribe.unsubscribe();
            }
            if (res === 'home') {
              this.createDocUnsubscribe = this.documentsAPI
                .createDocReq({
                  title: this.model.title,
                  content:
                    this.model.content != ''
                      ? this.model.content
                      : '<p>Hello, world!</p>',
                  docType: 'text',
                })
                .subscribe();
              this.model.content = '<p>Hello, world!</p>';
            }
          });
      });

    this.documentsAPI.docByIdRes().subscribe((object) => {
      this.setValue(object);
    });

    this.btnClicksService.updateBtnClick().subscribe(() => {
      this.model.content = '<p>Hello, world!</p>';
      this.model.docType = 'text';
    });

    this.btnClicksService.deleteBtnClick().subscribe(() => {
      this.model.content = '<p>Hello, world!</p>';
    });
  }

  ngOnDestroy() {
    if (this.clickSubscriber) {
      this.clickSubscriber.unsubscribe();
    }
    if (this.currentURIUnsubscribe) {
      this.currentURIUnsubscribe.unsubscribe();
    }
    if (this.createDocUnsubscribe) {
      this.createDocUnsubscribe.unsubscribe();
    }
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

    this.socketIoService.listen('updateContent').subscribe((obj: UpdateDoc) => {
      this.model.content = obj.content;
    });

    this.dataService.updateDocument({
      _id: this.model._id,
      content: this.model.content,
      title: this.model.title,
      docType: 'text',
    });

    this.socketIoService.emit('updateDocument', this.model);
  }

  ngOnInit() {
    this.socketIoService
      .listen('updateDocument')
      .subscribe((doc: UpdateDoc) => {
        this.socketIoService.emit('updateContent', {
          _id: doc._id,
          content: this.model.content,
          docType: 'text',
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
