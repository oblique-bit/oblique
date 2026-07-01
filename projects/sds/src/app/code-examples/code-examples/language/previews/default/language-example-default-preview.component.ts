import {ObButtonModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'app-language-example-default-preview',
	imports: [MatButtonModule, ObButtonModule],
	templateUrl: './language-example-default-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class LanguageExampleDefaultPreviewComponent {}
