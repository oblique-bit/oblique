import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {MasterLayoutNavigationItemDirective} from 'oblique';


@Component({
	template: '<li role="presentation" orMasterLayoutNavigationItem > test </li>'
})
class TestComponent {

}
describe('MasterLayoutNavigationItemDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				MasterLayoutNavigationItemDirective
			]
		});

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
	});

	it('should create component', () => {
		expect(component).toBeDefined();
	});

});
