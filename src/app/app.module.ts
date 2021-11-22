import { AuthAPIService } from 'src/app/services/auth.api.service';
import { AuthGuard } from './services/auth.guard';
import { DocumentsComponent } from './components/documents/documentsList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InterceptorService } from './services/interceptor.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let baseURL: string = 'http://localhost:1337/';
const LOCAL_DOMAINS: Array<string> = ['localhost', '127.0.0.1'];

if (LOCAL_DOMAINS.includes(window.location.hostname)) {
  baseURL = 'http://localhost:1337/';
} else {
  baseURL = 'https://jsramverk-angular-editor-baaa19.azurewebsites.net/';
}

const config: SocketIoConfig = { url: baseURL, options: {} };

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets',
  defaultOptions: { scrollBeyondLastLine: false },
  onMonacoLoad: () => {
    console.log((<any>window).monaco);
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LogTestComponent,
    HeaderComponent,
    ButtonComponent,
    DocumentsComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    CodeEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    DocEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forRoot([]),
    SocketIoModule.forRoot(config),
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MonacoEditorModule.forRoot(monacoConfig),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig },
    AuthGuard,
    AuthAPIService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    LogService,
    SocketIoService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
