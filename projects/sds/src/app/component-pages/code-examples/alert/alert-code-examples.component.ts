import {Component} from '@angular/core';
import {CodeExample} from '../code-example/code-example.model';
import {CodeExamples} from '../code-examples.model';

@Component({
	selector: 'app-code-example-alert',
	templateUrl: './alert-code-examples.component.html'
})
export class AlertCodeExamplesComponent implements CodeExamples {
	readonly componentId = 'alert-examples';

	readonly exampleInfo = new CodeExample({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
		html: require('!!raw-loader!./previews/info/alert-example-info-preview.component.html').default
	});

	readonly exampleSuccess = new CodeExample({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
		html: require('!!raw-loader!./previews/success/alert-example-success-preview.component.html').default
	});
}
