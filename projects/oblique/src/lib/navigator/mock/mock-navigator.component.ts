import {Component} from '@angular/core';

@Component({
	selector: 'or-navigator',
	template: `
		<ng-content></ng-content>`
})
export class MockNavigatorComponent {
	onKeyup($event): void {
	}

	onClick(): void {
	}

	navigateUp(): void {
	}
}
