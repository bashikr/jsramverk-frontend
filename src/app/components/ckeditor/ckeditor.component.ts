import { DataService } from '../../services/data.service';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { Component, ViewChild } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { BtnClicksService } from 'src/app/services/btnClicks.service';
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

  // @ViewChild('myEditor') myEditor: any;

  setValue(document: any) {
    this.model.content = document.content;
    this.model.title = document.title;
  }

  constructor(
    private dataService: DataService,
    private documentsAPI: DocumentsAPIService,
    private btnClicksService: BtnClicksService
  ) {
    this.btnClicksService.saveBtnClick().subscribe(() => {
      this.documentsAPI.createDocReq({
        title: this.model.title,
        content: this.model.content,
      });
      this.model.content = '<p>Hello, world!</p>';
    });

    this.dataService.getTitle().subscribe((title) => {
      this.model.title = title;
    });

    this.documentsAPI.docByIdRes().subscribe((object) => {
      this.setValue(object);
    });

    this.btnClicksService.updateBtnClick().subscribe(() => {
      this.dataService.editorInitValue().subscribe((content) => {
        this.model.content = content;
      });
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

//   public getArticleContent() {
//     if (this.myEditor && this.myEditor.editorInstance) {
//        return this.myEditor.editorInstance.getData();
//     }

//     return '';
//  }

  public onChange({ editor }: ChangeEvent) {
    this.model.content = editor.getData();
    this.btnClicksService.updateBtnClick().subscribe(() => {
      this.dataService.updateContent(this.model.content);
    });
  }
}
