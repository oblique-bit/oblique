import {Component, HostBinding, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObSpinnerModule} from '@oblique/oblique';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SideNavigationComponent} from './side-navigation/side-navigation.component';
import {FeedbackButtonComponent} from './feedback/feedback-button/feedback-button.component';
import {BannerComponent} from './banner/banner.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [CommonModule, RouterOutlet, ObSpinnerModule, SideNavigationComponent, FeedbackButtonComponent, BannerComponent]
})
export class AppComponent {
	@HostBinding('class.has-opened-mobile-navigation') showMobileNavigation = false;
	@HostBinding('class.has-banner') hasBanner = false;

	constructor() {
		const translate = inject(TranslateService);
		translate.addLangs(['en']);
		translate.setDefaultLang('en');
		translate.use('en');
	}

	doShowMobileNavigation(event: boolean): void {
		this.showMobileNavigation = event;
	}
}
