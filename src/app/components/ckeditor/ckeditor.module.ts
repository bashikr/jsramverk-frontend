import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CKEditorComponent } from './ckeditor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [CKEditorComponent],
  imports: [CKEditorModule, CommonModule],
  exports: [CKEditorModule, CKEditorComponent],
})
export class DocEditorModule {}
