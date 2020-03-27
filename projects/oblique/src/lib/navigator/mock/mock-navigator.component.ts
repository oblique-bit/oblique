import {Component} from '@angular/core';

@Component({
	selector: 'ob-navigator',
	template: ` <ng-content></ng-content>`
})
export class ObMockNavigatorComponent {
	onKeyup($event): void {}

	onClick(): void {}

	navigateUp(): void {}
}
