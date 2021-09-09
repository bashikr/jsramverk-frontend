import { Component, Input } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.css'],
})
export class CKEditorComponent {
  @Input() data1: any;
  @Input() Editor = DecoupledEditor;

  public onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );

    this.data1 = editor;
  }

  public saveData() {
    localStorage.setItem('test', this.data1.getData());
    console.log(this.data1.getData());
  }
}
