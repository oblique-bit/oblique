import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
	selector: '[appCodeExample]',
	standalone: true
})
export class CodeExampleDirective {
	constructor(public viewContainerRef: ViewContainerRef) {}
}
