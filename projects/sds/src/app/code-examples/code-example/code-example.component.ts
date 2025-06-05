import {ChangeDetectionStrategy, Component, OnInit, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeExampleDirective} from '../code-example.directive';
import {SourceCode} from './source-code.model';
import {IdPipe} from '../../shared/id/id.pipe';
import {HighlightedCodeComponent} from './highlighted-code/highlighted-code.component';
import {TabComponent} from '../../shared/tabs/tab/tab.component';
import {TabsComponent} from '../../shared/tabs/tabs.component';
import {PreviewComponent} from '../code-examples.model';

@Component({
	selector: 'app-code-example',
	templateUrl: './code-example.component.html',
	styleUrl: './code-example.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TabsComponent, TabComponent, CodeExampleDirective, CommonModule, HighlightedCodeComponent, IdPipe]
})
export class CodeExampleComponent implements OnInit {
	readonly codeSnippets = input<SourceCode[]>([]);
	readonly idPrefix = input('');
	readonly title = input('');
	readonly preview = input<PreviewComponent>(undefined);

	componentId = 'code-example';
	hasCodeInTitle = false;

	ngOnInit(): void {
		this.hasCodeInTitle = this.title()?.includes('<code>');
	}
}
