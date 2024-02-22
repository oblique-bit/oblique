import {Component, inject} from '@angular/core';
import {ObSpinnerModule} from '@oblique/oblique';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SideNavigationComponent} from './side-navigation/side-navigation.component';
import {FeedbackButtonComponent} from './feedback/feedback-button/feedback-button.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [RouterOutlet, ObSpinnerModule, SideNavigationComponent, FeedbackButtonComponent]
})
export class AppComponent {
	constructor() {
		const translate = inject(TranslateService);
		translate.addLangs(['en']);
		translate.setDefaultLang('en');
		translate.use('en');
	}
}
