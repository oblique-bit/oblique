import {Directive, ElementRef, HostBinding} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutApplicationService} from './master-layout-application.service';

@Directive({
	selector: '[orMasterLayoutApplication]',
	exportAs: 'orMasterLayoutApplication'
})
export class MasterLayoutApplicationDirective extends Unsubscribable {

	@HostBinding('class.has-cover') hasCover;
	@HostBinding('class.no-navigation') noNavigation;
	@HostBinding('class.application-fixed') applicationFixed;

	private defaultHasCover;
	private defaultNoNavigation;
	private defaultApplicationFixed;

	constructor(private layoutApplicationService: MasterLayoutApplicationService,
				private elementRef: ElementRef,
				private router: Router,
				private activatedRoute: ActivatedRoute) {
		super();
		layoutApplicationService.applicationDirective = this; // FIXME: refactor this to avoid circular coupling

		this.hasCover = this.defaultHasCover = this.elementRef.nativeElement.classList.contains('has-cover');
		this.noNavigation = this.defaultNoNavigation = this.elementRef.nativeElement.classList.contains('no-navigation');
		this.applicationFixed = this.defaultApplicationFixed = this.elementRef.nativeElement.classList.contains('application-fixed');

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(() => this.activatedRoute),
			map(route => {
				while (route.firstChild) {
					route = route.firstChild;
				}
				return route;
			}),
			filter(route => route.outlet === 'primary'),
			mergeMap(route => route.data),
			takeUntil(this.unsubscribe)
		).subscribe((data) => {
			const masterLayout = data.masterLayout || {};

			this.hasCover = masterLayout.hasCover !== undefined ? masterLayout.hasCover : this.defaultHasCover;
			this.noNavigation = masterLayout.noNavigation !== undefined ? masterLayout.noNavigation : this.defaultNoNavigation;
			this.applicationFixed = masterLayout.applicationFixed !== undefined ? masterLayout.applicationFixed : this.defaultApplicationFixed;
		});
	}
}
