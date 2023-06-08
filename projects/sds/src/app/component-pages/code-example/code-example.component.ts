import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Type, ViewChild, inject} from '@angular/core';
import {PreviewComponent} from '../code-examples.model';
import {CodeExampleDirective} from '../code-example.directive';
import {SourceCode} from './source-code.model';

@Component({
	selector: 'app-code-example',
	templateUrl: './code-example.component.html',
	styleUrls: ['./code-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeExampleComponent implements AfterViewInit {
	@Input() codeSnippets: SourceCode[] = [];
	@Input() idPrefix = '';
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
