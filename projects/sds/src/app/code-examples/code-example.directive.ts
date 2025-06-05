import {Directive, OnChanges, Type, ViewContainerRef, inject, input} from '@angular/core';
import {CodeExamples, PreviewComponent} from './code-examples.model';

@Directive({
	selector: '[appCodeExample]',
	standalone: true
})
export class CodeExampleDirective implements OnChanges {
	readonly codeExampleComponent = input<PreviewComponent | Type<CodeExamples>>(undefined);
	private readonly viewContainerRef = inject(ViewContainerRef);

	ngOnChanges(): void {
		this.viewContainerRef.clear();

		const codeExampleComponent = this.codeExampleComponent();
		if (codeExampleComponent) {
			this.viewContainerRef.createComponent(codeExampleComponent);
		}
	}
}
