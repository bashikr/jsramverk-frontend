import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BtnClicksService } from 'src/app/services/btnClicks.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() text?: string;
  @Input() type?: string;
  @Input() disabled?:boolean;
  @Output() btnClick: EventEmitter<BtnClicksService> = new EventEmitter();

  constructor() {
    this.text = 'add';
  }

  onClick() {
    this.btnClick.emit();
  }
}
