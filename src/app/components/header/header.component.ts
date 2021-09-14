import { SharedService } from '../../shared.service';
import { Component } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  faFileAlt = faFileAlt;

  constructor(private sharedService: SharedService) {}

  saveDataOnClick(event: string) {
    this.sharedService.sendTitleInputValue(event);
    this.sharedService.sendClickEvent();
  }
}
