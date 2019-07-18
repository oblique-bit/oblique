import {Component, HostListener} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe.class';

/**
 * @deprecated since version 4.0.0. This component is neither useful nor used and will be removed in future versions
 */
@Component({
	selector: 'or-navigator',
	template: `
		<ng-content></ng-content>`
})
export class NavigatorComponent extends Unsubscribable {

	constructor(private readonly router: Router, private readonly route: ActivatedRoute) {
		super();
		console.warn(`NavigatorComponent have been deprecated and will be removed in future versions.
		If your have a use case for it, please contact oblique@bit.admin.ch`);
	}

	@HostListener('document:keyup', ['$event'])
	onKeyup($event) {
		if ($event.keyCode === 27) {
			this.navigateUp();
		}
	}

	@HostListener('click')
	onClick() {
		this.navigateUp();
	}

	navigateUp() {
		let activeRoute: ActivatedRoute = this.route;
		while (activeRoute.firstChild) {
			activeRoute = activeRoute.firstChild;
		}
		activeRoute.data.pipe(takeUntil(this.unsubscribe)).subscribe((data) => {
			if (data['navigator'] && data['navigator'].up) {
				this.router.navigate(data['navigator'].up);
			} else {
				this.router.navigate(['../'], {relativeTo: activeRoute});
			}
		});
	}
}
