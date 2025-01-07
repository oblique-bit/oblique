import {ObButtonModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {Component} from '@angular/core';

@Component({
	selector: 'app-language-example-default-preview',
	templateUrl: './language-example-default-preview.component.html',
	imports: [MatButtonModule, ObButtonModule]
})
export class LanguageExampleDefaultPreviewComponent {}
