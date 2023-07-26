import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-<%= dasherizedCodeExampleName %>-example-<%= dasherizedPreviewName %>-preview',
	templateUrl: './<%= dasherizedCodeExampleName %>-example-<%= dasherizedPreviewName %>-preview.component.html',
	standalone: true
})
export class <%= componentName %> implements PreviewComponent {}
