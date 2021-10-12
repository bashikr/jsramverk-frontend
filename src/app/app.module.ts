import { DocumentsComponent } from './components/documents/documentsList.component';
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

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketIoService } from './services/socket.io.service';

let baseURL: string = 'http://localhost:1337/';
const LOCAL_DOMAINS: Array<string> = ['localhost', '127.0.0.1'];

if (LOCAL_DOMAINS.includes(window.location.hostname)) {
  baseURL = 'http://localhost:1337/';
} else {
  baseURL = 'https://jsramverk-angular-editor-baaa19.azurewebsites.net/';
}

const config: SocketIoConfig = { url: baseURL, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LogTestComponent,
    HeaderComponent,
    ButtonComponent,
    DocumentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    DocEditorModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forRoot([]),
    SocketIoModule.forRoot(config),
  ],
  providers: [LogService, SocketIoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
