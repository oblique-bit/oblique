import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
	selector: '[appCodeExample]'
})
export class CodeExampleDirective {
	constructor(public viewContainerRef: ViewContainerRef) {}
}
