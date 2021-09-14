import { SharedService } from '../../shared.service';
import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.css'],
})
export class CKEditorComponent {
  clickEventSubscription: Subscription;
  data: any = 'Nothing yet!';
  public Editor = DecoupledEditor;

  constructor(private sharedService: SharedService) {
    this.clickEventSubscription = this.sharedService
      .getClickEvent()
      .subscribe(() => {
        this.sendDataToLocalStorage();
      });
  }

  public onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    this.data = editor;
  }

  sendDataToLocalStorage() {
    localStorage.setItem('test', this.data.getData());
    console.log(this.data.getData());
    console.log(this.sharedService.getTitleValue());
  }
}
