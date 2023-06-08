import {Component} from '@angular/core';
import {SourceCode} from '../../code-example/source-code.model';
import {CodeExamples} from '../../code-examples.model';

@Component({
	selector: 'app-code-example-alert',
	templateUrl: './alert-code-examples.component.html'
})
export class AlertCodeExamplesComponent implements CodeExamples {
	readonly componentId = 'alert-examples';

	readonly codeSnippetsInfo = [
		new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require('!!raw-loader!./previews/info/alert-example-info-preview.component.html').default as string,
			'HTML'
		)
	];

	readonly codeSnippetsSuccess = [
		new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require('!!raw-loader!./previews/success/alert-example-success-preview.component.html').default as string,
			'HTML'
		)
	];
}
