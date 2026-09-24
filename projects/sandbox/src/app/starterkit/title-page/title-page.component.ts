import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-title-page',
	standalone: false,
	templateUrl: './title-page.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TitlePageComponent {}
