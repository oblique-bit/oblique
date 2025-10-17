import {Component} from '@angular/core';
import {appVersion} from '@oblique/version';

@Component({
	selector: 'sb-home',
	standalone: false,
	templateUrl: './home.page.html',
	styleUrl: './home.page.scss'
})
export class HomePageComponent {
	version = appVersion;
}
