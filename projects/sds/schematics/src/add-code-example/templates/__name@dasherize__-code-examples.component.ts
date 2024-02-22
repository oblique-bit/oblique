import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';

@Component({
	selector: 'app-code-example-<%= dasherizedName %>',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class <%=classifiedName%>CodeExamplesComponent extends CodeExamples {
	readonly componentId = '<%= dasherizedName %>-examples';
	readonly previews: CodeExample[] = [];
}
