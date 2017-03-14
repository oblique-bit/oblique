import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../src';
import {TranslateService} from 'ng2-translate';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	constructor(notificationService: NotificationService, private translate: TranslateService) {
		notificationService.success('Welcome to Oblique2-Reactive');
		translate.setDefaultLang('en');
		translate.use('en');
	}

	public isLangActive(lang: string): boolean {
		return this.translate.currentLang === lang;
	}

	public changeLang(lang: string) {
		this.translate.use(lang);
	}

	ngOnInit(): void {
		//
	}
}
