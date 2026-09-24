import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObTranslateParamsModule} from '@oblique/oblique';

@Component({
	selector: 'app-translate-params-example-default-preview',
	imports: [ObTranslateParamsModule],
	templateUrl: './translate-params-example-default-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TranslateParamsExampleDefaultPreviewComponent {}
