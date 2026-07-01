import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-date-component-example-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './date-component-example-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class DateComponentExampleComponent {}
