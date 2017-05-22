import {Directive, ElementRef, HostBinding} from '@angular/core';
import {LayoutManagerService} from './layout-manager.service';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

@Directive({
	selector: '.application'
})
export class LayoutManagerDirective {

	@HostBinding('class.has-cover') hasCover;
	@HostBinding('class.no-navigation') noNavigation;

	private defaultHasCover;
	private defaultNoNavigation;

	constructor(private layoutManagerService: LayoutManagerService,
				private elementRef: ElementRef,
				private router: Router,
				private activatedRoute: ActivatedRoute) {
		layoutManagerService.layoutManagerDirective = this;

		this.hasCover = this.defaultHasCover = this.elementRef.nativeElement.classList.contains('has-cover');
		this.noNavigation = this.defaultNoNavigation = this.elementRef.nativeElement.classList.contains('no-navigation');

		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.map(() => this.activatedRoute)
			.map(route => {
				while (route.firstChild) {
					route = route.firstChild;
				}
				return route;
			})
			.filter(route => route.outlet === 'primary')
			.mergeMap(route => route.data)
			.subscribe((data) => {
				let layoutManager = data.layoutManager || {};

				this.hasCover = layoutManager.hasCover !== undefined ? layoutManager.hasCover : this.defaultHasCover;
				this.noNavigation = layoutManager.noNavigation !== undefined ? layoutManager.noNavigation : this.defaultNoNavigation;
			});
	}
}
