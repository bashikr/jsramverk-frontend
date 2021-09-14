import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonComponent } from './components/button/button.component';
import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './app.component';
import { LogService } from './components/log/log.service';
import { LogTestComponent } from './components/log/log.component';
import { DocEditorModule } from './components/ckeditor/ckeditor.module';
import { DocumentCreateComponent } from './components/documents/document-create/document-create.component';
import { DocumentsDisplayComponent } from './components/documents/documents-display/documents-display.component';
@NgModule({
  declarations: [
    AppComponent,
    LogTestComponent,
    DocumentCreateComponent,
    DocumentsDisplayComponent,
    HeaderComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DocEditorModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule.forRoot([
      { path: 'documents', component: DocumentsDisplayComponent },
      { path: 'hello', component: DocumentsDisplayComponent },
      { path: 'hello/:msg', component: DocumentsDisplayComponent },
    ]),
  ],
  providers: [LogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
