import {Component, Input, OnInit, ViewEncapsulation, numberAttribute} from '@angular/core';
import {NgIf} from '@angular/common';
import {ObServiceNavigationModule} from '../../../oblique/src/lib/service-navigation/service-navigation.module';
import {ObEPamsEnvironment} from '../../../oblique/src/lib/service-navigation/service-navigation.model';

@Component({
	standalone: true,
	selector: 'ob-service-navigation-web-component',
	templateUrl: './service-navigation-web-component.component.html',
	styleUrl: '../../../oblique/src/styles/scss/oblique-core.scss',
	encapsulation: ViewEncapsulation.None,
	imports: [ObServiceNavigationModule, NgIf]
})
export class ObServiceNavigationWebComponentComponent implements OnInit {
	@Input() environment: 'DEV' | 'REF' | 'TEST' | 'ABN' | 'PROD';
	@Input({transform: numberAttribute}) maxLastUsedApplications: number;
	@Input({transform: numberAttribute}) maxFavoriteApplications: number;
	@Input() rootUrl: string;
	@Input() returnUrl: string;

	environmentParsed: ObEPamsEnvironment;

	ngOnInit(): void {
		this.environmentParsed = this.parseEnvironment(this.environment);
	}

	private parseEnvironment(environmentName: string): ObEPamsEnvironment {
		const environmentNames = Object.keys(ObEPamsEnvironment);
		if (!environmentNames.includes(environmentName)) {
			throw new Error(
				`An environment has to be provided, valid values are: ${environmentNames.join(', ')}, but "${environmentName}" has been provided`
			);
		}
		return ObEPamsEnvironment[environmentName];
	}
}
