import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
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
	styleUrls: ['./code-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [TabsComponent, TabComponent, CodeExampleDirective, CommonModule, HighlightedCodeComponent, IdPipe]
})
export class CodeExampleComponent implements AfterViewInit {
	@Input() codeSnippets: SourceCode[] = [];
	@Input() idPrefix = '';
	@Input() title = '';
	@Input() preview: PreviewComponent;

	componentId = 'code-example';
	hasCodeInTitle = false;

	ngAfterViewInit(): void {
		this.loadComponent();
	}

	private loadComponent(): void {
		if (this.title?.includes('<code>')) {
			this.hasCodeInTitle = true;
		}
	}
}
