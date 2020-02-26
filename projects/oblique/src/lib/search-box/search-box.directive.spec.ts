import {ObSearchBoxDirective} from './search-box.directive';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgControl} from '@angular/forms';
import {Component} from '@angular/core';

@Component({
	template: '<input [id]="id" class="search-box-input" type="search" [obSearchBox]="items" />'
})
class TestComponent {
	// clickCount is not necessary but it's used here to verify that the component
	// is actually getting clicked
	items = 0;
	id = 0;
}
describe('SearchBoxDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				ObSearchBoxDirective
			],
			providers: [
				NgControl
			]
		});

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
	});

	it('should create component', () => {
		expect(component).toBeDefined();
	});

});
