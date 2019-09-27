import { Component } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {ToggleDirective} from 'oblique';

@Component({
	template: `<input orToggle />`
})
class TestComponent {
}

describe('ToggleDirective', () => {
	let directive: ToggleDirective;
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				ToggleDirective
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
		const element = fixture.debugElement.query(By.directive(ToggleDirective));
		directive = element.injector.get(ToggleDirective);
	});

	it('should create an instance', () => {
		expect(component).toBeTruthy();
		expect(directive).toBeTruthy();
	});
});
