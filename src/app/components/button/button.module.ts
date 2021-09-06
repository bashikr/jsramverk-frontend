import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonComponent } from './button.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  declarations: [ButtonComponent],
  imports: [ BrowserModule, CommonModule, AppRoutingModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
