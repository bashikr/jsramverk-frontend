import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() text?: string;
  @Input() color?: string;
  @Input() backgroundColor?: string;
  @Input() type?: string;
  @Input() disabled?:boolean;
  @Output() btnClick: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.text = 'add';
    this.color = 'white';
    this.backgroundColor = 'blue';
  }

  onClick() {
    this.btnClick.emit();
  }
}
