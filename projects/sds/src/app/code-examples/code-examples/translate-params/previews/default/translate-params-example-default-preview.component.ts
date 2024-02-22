import {Component} from '@angular/core';
import {ObTranslateParamsModule} from '@oblique/oblique';

@Component({
	selector: 'app-translate-params-example-default-preview',
	templateUrl: './translate-params-example-default-preview.component.html',
	standalone: true,
	imports: [ObTranslateParamsModule]
})
export class TranslateParamsExampleDefaultPreviewComponent {}
