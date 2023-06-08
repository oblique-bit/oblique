import {Component} from '@angular/core';
import {CodeExamples} from '../../code-examples.model';

@Component({
	selector: 'app-code-example-alert',
	templateUrl: './alert-code-examples.component.html'
})
export class AlertCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'alert-examples';
	readonly codeSnippetsInfo = [this.getSnippet('alert', 'info/alert-example-info-preview.component.html', 'HTML')];
	readonly codeSnippetsSuccess = [this.getSnippet('alert', 'success/alert-example-success-preview.component.html', 'HTML')];
}
