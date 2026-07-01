import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-date-example-default-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './date-example-default-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class DateExampleDefaultPreviewComponent {}
