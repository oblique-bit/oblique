import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {ObMockMasterLayoutComponentService} from '../_mocks/mock-master-layout.component.service';

@Component({
	template: '<li role="presentation" obMasterLayoutNavigationItem> test </li>'
})
class TestComponent {}
describe('ObMasterLayoutNavigationItemDirective', () => {
	let component: TestComponent;
	let element: DebugElement;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObMasterLayoutNavigationItemDirective],
			providers: [
				{provide: ObMasterLayoutComponentService, useClass: ObMockMasterLayoutComponentService},
				{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService}
			]
		});

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		element = fixture.debugElement.query(By.directive(ObMasterLayoutNavigationItemDirective));
	});

	it('should create component', () => {
		expect(component).toBeDefined();
	});

	it('should have ob-master-layout-navigation-item class', () => {
		expect(element.nativeElement.classList.contains('ob-master-layout-navigation-item')).toBe(true);
	});
});
