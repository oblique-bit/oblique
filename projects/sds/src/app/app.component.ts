import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {ObSpinnerModule} from '@oblique/oblique';
import {Router, RouterOutlet} from '@angular/router';
import {type Observable, filter, map, tap} from 'rxjs';
import {CmsDataService} from './cms/cms-data.service';
import {SideNavigationComponent} from './side-navigation/side-navigation.component';
import {BannerComponent} from './banner/banner.component';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, ObSpinnerModule, SideNavigationComponent, BannerComponent, AsyncPipe],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
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
		// remove the accessibility statement route that Oblique adds automatically and is not meaningful in SDS
		inject(Router).config.shift();
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
