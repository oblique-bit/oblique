import {Component} from '@angular/core';
import {CodeExamples} from '../../code-examples.model';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';

@Component({
	selector: 'app-code-example-banner',
	templateUrl: './banner-code-examples.component.html',
	standalone: true,
	imports: [CommonModule, CodeExampleComponent]
})
export class BannerCodeExamplesComponent extends CodeExamples {}
