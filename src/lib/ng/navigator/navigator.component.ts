import {Component, HostListener} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';

@Component({
	selector: 'or-navigator',
	template: `<ng-content></ng-content>`
})
export class NavigatorComponent extends Unsubscribable {

	constructor(private router: Router, private route: ActivatedRoute) {
		super();
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
