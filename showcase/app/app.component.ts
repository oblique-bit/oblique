import { Component, OnInit } from '@angular/core';
import { NotificationService, SpinnerService } from '../../src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app works!';

  constructor(notificationService:NotificationService, private spinnerService:SpinnerService) {
    notificationService.success('FUU');

  }

  ngOnInit(): void {
    this.spinnerService.activateSpinner();
    setTimeout(() => {
      this.spinnerService.deactivateSpinner()
    }, 3000);
  }
}
