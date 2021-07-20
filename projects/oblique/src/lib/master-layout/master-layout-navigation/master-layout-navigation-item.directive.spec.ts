import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {ObGlobalEventsService, ObMasterLayoutNavigationItemDirective} from 'oblique';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';

@Component({
	template: '<li role="presentation" obMasterLayoutNavigationItem > test </li>'
})
class TestComponent {}
describe('MasterLayoutNavigationItemDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObMasterLayoutNavigationItemDirective],
			providers: [{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService}]
		});

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
	});

	it('should create component', () => {
		expect(component).toBeDefined();
	});
});
