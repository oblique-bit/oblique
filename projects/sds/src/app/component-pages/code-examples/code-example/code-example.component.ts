import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {SourceCode} from './source-code.model';

@Component({
	selector: 'app-code-example',
	templateUrl: './code-example.component.html',
	styleUrls: ['./code-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeExampleComponent {
	@Input() codeSnippets: SourceCode[] = [];
	@Input() idPrefix = '';
	@Input() preview?: TemplateRef<unknown>;

	componentId = 'code-example';
}
