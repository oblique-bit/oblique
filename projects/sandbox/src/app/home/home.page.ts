import {Component} from '@angular/core';
import {appVersion} from '@oblique/version';

@Component({
	selector: 'sb-home',
	templateUrl: './home.page.html',
	styleUrl: './home.page.scss',
	standalone: false
})
export class HomePageComponent {
	version = appVersion;
}
