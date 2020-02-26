import { Component } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {ObToggleDirective} from 'oblique';

@Component({
	template: `<input obToggle />`
})
class TestComponent {
}

describe('ToggleDirective', () => {
	let directive: ObToggleDirective;
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				ObToggleDirective
			],
			imports: [
				RouterTestingModule
			],
			providers: []
		});
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		const element = fixture.debugElement.query(By.directive(ObToggleDirective));
		directive = element.injector.get(ObToggleDirective);
	});

	it('should create an instance', () => {
		expect(component).toBeTruthy();
		expect(directive).toBeTruthy();
	});
});
