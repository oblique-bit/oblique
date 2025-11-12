import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-date-component-example-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './date-component-example-preview.component.html',
})
export class DateComponentExampleComponent {}
