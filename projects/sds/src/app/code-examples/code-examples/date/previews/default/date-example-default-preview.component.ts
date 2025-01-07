import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-date-example-default-preview',
	templateUrl: './date-example-default-preview.component.html',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class DateExampleDefaultPreviewComponent {}
