import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
	selector: 'app-translations-example-html-in-translations-preview',
	imports: [TranslatePipe],
	templateUrl: './translations-example-html-in-translations-preview.component.html',
})
export class TranslationsExampleHtmlInTranslationsPreviewComponent {
	protected readonly customListParameter = {withParameter: '<strong>your custom parameter</strong>'};
}
