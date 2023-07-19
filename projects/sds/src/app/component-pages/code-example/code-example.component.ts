import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Type, ViewChild, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreviewComponent} from '../code-examples.model';
import {CodeExampleDirective} from '../code-example.directive';
import {SourceCode} from './source-code.model';
import {IdPipe} from '../../shared/id/id.pipe';
import {HighlightedCodeComponent} from './highlighted-code/highlighted-code.component';
import {TabComponent} from '../tabs/tab/tab.component';
import {TabsComponent} from '../tabs/tabs.component';

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
	@Input() preview: Type<PreviewComponent>;
	@ViewChild(CodeExampleDirective) host!: CodeExampleDirective;

	componentId = 'code-example';

	private readonly cdr = inject(ChangeDetectorRef);

	ngAfterViewInit(): void {
		this.loadComponent();
	}

	private loadComponent(): void {
		if (this.host && this.preview) {
			const {viewContainerRef} = this.host;
			viewContainerRef.clear();
			viewContainerRef.createComponent<PreviewComponent>(this.preview);
			this.cdr.detectChanges(); // This ensures that the CSS of the preview component is loaded
		}
	}
}
