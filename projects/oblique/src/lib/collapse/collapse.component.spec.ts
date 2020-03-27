import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {ObCollapseComponent, OBLIQUE_COLLAPSE_ACTIVE} from './collapse.component';

@Component({
	template: `
		<ob-collapse [(active)]="active" [direction]="direction" column-main-content [iconPosition]="iconPosition">
			<span id="{{ collapseTitle }}_title" obCollapseHeader> {{ collapseTitle }}</span>
			<p obCollapseMain>Lorem ipsum dolor sit amet</p>
		</ob-collapse>
	`
})
class TestCollaspseComponent {
	active = true;
	direction = 'up-right';
	iconPosition = 'right';
	collapseTitle = 'mockTitle';
}

describe('CollapseComponent', () => {
	let fixture: ComponentFixture<TestCollaspseComponent>;
	let testComponent: TestCollaspseComponent;
	let component: ObCollapseComponent;
	let element: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestCollaspseComponent, ObCollapseComponent],
			imports: [NoopAnimationsModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{provide: OBLIQUE_COLLAPSE_ACTIVE, useValue: false}]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestCollaspseComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(ObCollapseComponent));
		component = element.injector.get(ObCollapseComponent);
	}));

	it('should create', async(() => {
		expect(testComponent).toBeTruthy();
	}));

	it('should active', async(() => {
		expect(testComponent.active).toEqual(true);
	}));

	it('should set active to false', () => {
		const spy = jest.spyOn(component, 'active', 'set');
		component.active = true;
		expect(spy).toHaveBeenCalled();
		expect(component.active).toBeTruthy();
		spy.mockRestore();
	});
});
