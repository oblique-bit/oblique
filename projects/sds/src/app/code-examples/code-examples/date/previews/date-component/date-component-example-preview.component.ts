import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-date-component-example-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './date-component-example-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class DateComponentExampleComponent {}
