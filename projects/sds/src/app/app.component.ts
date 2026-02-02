import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObSpinnerModule} from '@oblique/oblique';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {type Observable, filter, map, tap} from 'rxjs';
import {CmsDataService} from './cms/cms-data.service';
import {SideNavigationComponent} from './side-navigation/side-navigation.component';
import {BannerComponent} from './banner/banner.component';

@Component({
	selector: 'app-root',
	imports: [CommonModule, RouterOutlet, ObSpinnerModule, SideNavigationComponent, BannerComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	host: {
		'[class.has-opened-mobile-navigation]': 'showMobileNavigation',
		'[class.has-banner]': 'hasBanner',
	},
})
export class AppComponent {
	showMobileNavigation = false;
	hasBanner = false;
	readonly bannerData$: Observable<string> = this.getBannerData(inject(CmsDataService));

	constructor() {
		const translate = inject(TranslateService);
		translate.addLangs(['en']);
		translate.setFallbackLang('en');
		translate.use('en');
	}

	doShowMobileNavigation(event: boolean): void {
		this.showMobileNavigation = event;
	}

	private getBannerData(cmsDataService: CmsDataService): Observable<string> {
		return cmsDataService.getBanner().pipe(
			map(data => data.data.content),
			filter(content => Boolean(content)),
			tap(() => {
				this.hasBanner = true;
			})
		);
	}
}
