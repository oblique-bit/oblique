import {Component} from '@angular/core';
import {CodeExamples} from '../../code-examples.model';

@Component({
	selector: 'app-code-example-banner',
	templateUrl: './banner-code-examples.component.html'
})
export class BannerCodeExamplesComponent extends CodeExamples {}
