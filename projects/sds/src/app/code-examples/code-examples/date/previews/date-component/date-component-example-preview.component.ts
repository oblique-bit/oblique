import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-date-component-example-preview',
	templateUrl: './date-component-example-preview.component.html',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class DateComponentExampleComponent {}
