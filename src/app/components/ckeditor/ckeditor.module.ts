import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CKEditorComponent } from './ckeditor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [CKEditorComponent],
  imports: [CKEditorModule, CommonModule, FormsModule],
  exports: [CKEditorModule, CKEditorComponent],
})
export class DocEditorModule {}
