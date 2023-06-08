import {Component} from '@angular/core';
import {CodeExamples} from '../code-examples.model';

@Component({
	selector: 'app-no-code-examples-match',
	templateUrl: './no-code-examples-match.component.html'
})
export class NoCodeExamplesMatchComponent extends CodeExamples {}
