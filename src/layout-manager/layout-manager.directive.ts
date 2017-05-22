import {Directive, ElementRef, Renderer2} from '@angular/core';
import {LayoutManagerService} from './layout-manager.service';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

@Directive({
	selector: '.application'
})
export class LayoutManagerDirective {
	private previousData: any = {};

	constructor(private layoutManagerService: LayoutManagerService,
				private elementRef: ElementRef,
				private renderer: Renderer2,
				private router: Router,
				private activatedRoute: ActivatedRoute) {
		layoutManagerService.layoutManagerDirective = this;

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
				let uiLayout = data.uiLayout || {};

				this.toggleClass(uiLayout.application, this.previousData.application);
				this.previousData = uiLayout;
			});
	}

	private toggleClass(newClasses = [], classesToRemove = []) {
		classesToRemove.forEach(clazz => {
			this.renderer.removeClass(this.elementRef.nativeElement, clazz);
		});

		newClasses.forEach(clazz => {
			this.renderer.addClass(this.elementRef.nativeElement, clazz);
		});
	}

	set hasCover(value) {
		if (value) {
			this.renderer.addClass(this.elementRef.nativeElement, 'has-cover');
		} else {
			this.renderer.removeClass(this.elementRef.nativeElement, 'has-cover');
		}
	}

	get hasCover() {
		return this.elementRef.nativeElement.classList.contains('has-cover');
	}

	set noNavigation(value) {
		if (value) {
			this.renderer.addClass(this.elementRef.nativeElement, 'no-navigation');
		} else {
			this.renderer.removeClass(this.elementRef.nativeElement, 'no-navigation');
		}
	}

	get noNavigation() {
		return this.elementRef.nativeElement.classList.contains('no-navigation');
	}
}
