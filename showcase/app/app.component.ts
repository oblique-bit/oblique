import {Component, OnInit} from '@angular/core';
import {NotificationService, SpinnerService} from '../../src';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'app works!';

    constructor(notificationService: NotificationService, private spinnerService: SpinnerService) {
        notificationService.success('Welcome to Oblique2-Reactive');
    }

    ngOnInit(): void {
        //
    }
}
