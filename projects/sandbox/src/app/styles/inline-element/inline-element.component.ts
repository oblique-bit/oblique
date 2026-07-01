import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-inline-element',
	standalone: false,
	templateUrl: './inline-element.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class InlineElementComponent {}
