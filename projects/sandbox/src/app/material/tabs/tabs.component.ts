import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-tabs',
	standalone: false,
	templateUrl: './tabs.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TabsComponent {}
