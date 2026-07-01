import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-menu',
	standalone: false,
	templateUrl: './menu.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class MenuComponent {}
