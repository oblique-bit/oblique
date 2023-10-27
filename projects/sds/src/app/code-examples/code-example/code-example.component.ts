import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild, inject} from '@angular/core';
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
	@ViewChild(CodeExampleDirective) host!: CodeExampleDirective;

	componentId = 'code-example';
	hasCodeInTitle = false;

	private readonly cdr = inject(ChangeDetectorRef);

	ngAfterViewInit(): void {
		this.loadComponent();
	}

	private loadComponent(): void {
		if (this.host && this.preview) {
			const {viewContainerRef} = this.host;
			viewContainerRef.clear();
			viewContainerRef.createComponent(this.preview);
			this.cdr.detectChanges(); // This ensures that the CSS of the preview component is loaded

			if (this.title.includes('<code>')) {
				this.hasCodeInTitle = true;
			}
		}
	}
}
