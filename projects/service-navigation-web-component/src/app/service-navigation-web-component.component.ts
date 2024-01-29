import {Component, ViewEncapsulation} from '@angular/core';
import {ObServiceNavigationModule} from '../../../oblique/src/lib/service-navigation/service-navigation.module';

@Component({
	standalone: true,
	selector: 'ob-service-navigation-web-component',
	templateUrl: './service-navigation-web-component.component.html',
	styleUrl: '../../../oblique/src/styles/scss/oblique-core.scss',
	encapsulation: ViewEncapsulation.None,
	imports: [ObServiceNavigationModule]
})
export class ObServiceNavigationWebComponentComponent {}
