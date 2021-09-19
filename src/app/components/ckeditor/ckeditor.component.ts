import { InternalConnectionService } from '../services/internalConnection.service';
import { DocumentsAPIService } from '../services/documents.api.service';
import { Component } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.css'],
})
export class CKEditorComponent {
  public Editor = DecoupledEditor;

  public model = {
    title: 'undefined',
    content: '<p>Hello, world!</p>',
  };

  setValue(document: any) {
    this.model.content = document.content;
    this.model.title = document.title;
  }

  constructor(
    private sharedService: InternalConnectionService,
    private documentsAPI: DocumentsAPIService
  ) {
    this.sharedService.getClickEvent().subscribe(() => {
      this.documentsAPI.setDocumentsRequest({
        title: this.model.title,
        content: this.model.content,
      });
      this.model.content = '<p>Hello, world!</p>';
    });

    this.sharedService.getTitleValue().subscribe((title) => {
      this.model.title = title;
    });

    this.documentsAPI.getDocumentByIdResponse().subscribe((object) => {
      this.setValue(object[0]);
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

  public onChange({ editor }: ChangeEvent) {
    this.model.content = editor.getData();

    this.sharedService.getClickEventUpdateButton().subscribe(() => {
      this.sharedService.setUpdateContent(this.model.content);
    });
  }
}
