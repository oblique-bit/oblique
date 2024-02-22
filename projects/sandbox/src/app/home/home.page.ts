import {Component} from '@angular/core';
import {appVersion} from '@oblique/version';

@Component({
	selector: 'sb-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss']
})
export class HomePageComponent {
	version = appVersion;
}
