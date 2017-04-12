import {Component, HostListener} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
	selector: 'navigator',
	template: `<ng-content></ng-content>`
})
export class NavigatorComponent {

	constructor(private router: Router, private route: ActivatedRoute) {

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
		activeRoute.data.subscribe((data) => {
			if (data['navigator'] && data['navigator'].up) {
				this.router.navigate(data['navigator'].up);
			} else {
				this.router.navigate(['../'], {relativeTo: activeRoute});
			}
		});
	}
}
