import {ViewContainerRef} from '@angular/core';
import {CodeExampleDirective} from './code-example.directive';

describe(`${CodeExampleDirective.name}`, () => {
	it('should create an instance', () => {
		const directive = new CodeExampleDirective({} as ViewContainerRef);
		expect(directive).toBeTruthy();
	});
});
