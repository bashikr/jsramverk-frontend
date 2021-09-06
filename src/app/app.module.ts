import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogService } from './components/log/log.service';
import { LogTestComponent } from './components/log/log.component';
import { DocEditorModule } from './components/ckeditor/ckeditor.module';
@NgModule({
  declarations: [AppComponent, LogTestComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule, DocEditorModule],
  providers: [LogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
