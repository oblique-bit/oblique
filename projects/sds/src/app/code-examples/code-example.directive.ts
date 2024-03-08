import {Directive, Input, OnChanges, Type, ViewContainerRef, inject} from '@angular/core';
import {CodeExamples, PreviewComponent} from './code-examples.model';

@Directive({
	selector: '[appCodeExample]',
	standalone: true
})
export class CodeExampleDirective implements OnChanges {
	@Input() codeExampleComponent: PreviewComponent | Type<CodeExamples>;
	private readonly viewContainerRef = inject(ViewContainerRef);

	ngOnChanges(): void {
		this.viewContainerRef.clear();

		if (this.codeExampleComponent) {
			this.viewContainerRef.createComponent(this.codeExampleComponent);
		}
	}
}
