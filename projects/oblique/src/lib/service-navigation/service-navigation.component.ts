import {Component, Input, OnChanges, OnInit, ViewEncapsulation} from '@angular/core';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObEPamsEnvironment} from './service-navigation.model';

@Component({
	selector: 'ob-service-navigation',
	templateUrl: './service-navigation.component.html',
	styleUrls: ['./service-navigation.component.scss'],
	providers: [ObServiceNavigationService],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation'}
})
export class ObServiceNavigationComponent implements OnInit, OnChanges {
	@Input() environment: ObEPamsEnvironment;
	@Input() rootUrl: string;
	@Input() returnUrl: string;
	readonly loginUrl$ = this.headerControlsService.getLoginUrl$();
	readonly logoutUrl$ = this.headerControlsService.getLogoutUrl$();
	readonly loginState$ = this.headerControlsService.getLoginState$();

	constructor(private readonly headerControlsService: ObServiceNavigationService) {}

	ngOnInit(): void {
		this.headerControlsService.setUpRootUrls(this.environment, this.rootUrl);
	}

	ngOnChanges(): void {
		this.headerControlsService.setReturnUrl(this.returnUrl);
	}
}
