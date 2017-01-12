import { Component } from '@angular/core';
import { NotificationService } from '../../src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(test:NotificationService) {
    test.success('FUU');
  }
}
