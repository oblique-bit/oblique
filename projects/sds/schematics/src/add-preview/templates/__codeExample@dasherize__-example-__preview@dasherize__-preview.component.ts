import {Component} from '@angular/core';

@Component({
	selector: 'app-<%= dasherizedCodeExampleName %>-example-<%= dasherizedPreviewName %>-preview',
	templateUrl: './<%= dasherizedCodeExampleName %>-example-<%= dasherizedPreviewName %>-preview.component.html',
	standalone: true
})
export class <%= componentName %> {}
