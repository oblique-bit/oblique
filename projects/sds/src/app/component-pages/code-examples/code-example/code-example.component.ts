import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {CodeExample} from './code-example.model';

@Component({
	selector: 'app-code-example',
	templateUrl: './code-example.component.html',
	styleUrls: ['./code-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeExampleComponent {
	@Input() example: CodeExample = new CodeExample();
	@Input() idPrefix = '';
	@Input() preview?: TemplateRef<unknown>;

	componentId = 'code-example';
}
