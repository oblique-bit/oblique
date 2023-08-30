import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TabComponent} from './tab/tab.component';
import {TabsComponent} from './tabs.component';
import {IdPipe} from '../../shared/id/id.pipe';
import {UnitTestHelpers} from '../../../test-helpers/unit-test-helpers/unit-test-helpers';

@Component({
	selector: 'app-tabs-wrapper',
	template: `<app-tabs [idPrefix]="componentId" [id]="componentId | id : ['tabs']">
		<app-tab name="test-tab-1" [active]="true" [idPrefix]="componentId | id : ['tab', 1]" [id]="componentId | id : ['tab', 1]">
			<p [id]="componentId | id : ['tab-1-content']">test-tab-1-p</p></app-tab
		>
		<app-tab name="test-tab-2" [active]="false" [idPrefix]="componentId | id : ['tab', 2]" [id]="componentId | id : ['tab', 2]">
			<p [id]="componentId | id : ['tab-2-content']">test-tab-2-p</p></app-tab
		>
	</app-tabs>`
})
class TabsWrapperComponent {
	readonly componentId = 'tabs-wrapper';
}

describe(`${TabsComponent.name}`, () => {
	let fixture: ComponentFixture<TabsWrapperComponent>;
	let component: TabsWrapperComponent;
	const idPipe = new IdPipe();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TabsWrapperComponent],
			imports: [IdPipe, TabComponent, TabsComponent],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(TabsWrapperComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should display 1st tab content', () => {
		expect(
			UnitTestHelpers.getDebugElementById<TabsWrapperComponent>(fixture, idPipe.transform(component.componentId, ['tab-1-content']))
		).toBeTruthy();
	});

	it('should have 1st tab be active', () => {
		expect(
			UnitTestHelpers.getClassForDebugElementById<TabsWrapperComponent>(
				fixture,
				idPipe.transform(component.componentId, ['tabs-button', 0]),
				'active'
			)
		).toBeTruthy();
	});

	it('should not have 2nd tab be active', () => {
		expect(
			UnitTestHelpers.getClassForDebugElementById<TabsWrapperComponent>(
				fixture,
				idPipe.transform(component.componentId, ['tab', 1]),
				'active'
			)
		).toBeFalsy();
	});

	it('should not display 2nd tab content', () => {
		expect(
			UnitTestHelpers.getDebugElementById<TabsWrapperComponent>(fixture, idPipe.transform(component.componentId, ['tab-2-content']))
		).toBeFalsy();
	});

	it.each<{id: number}>([{id: 1}, {id: 2}])('should display tab with id: $id', ({id}) => {
		expect(
			UnitTestHelpers.getDebugElementById<TabsWrapperComponent>(fixture, idPipe.transform(component.componentId, ['tab', id]))
		).toBeTruthy();
	});

	it.each<{id: number}>([{id: 0}, {id: 3}, {id: 4}])('should not display tab with id: $id', ({id}) => {
		expect(
			UnitTestHelpers.getDebugElementById<TabsWrapperComponent>(fixture, idPipe.transform(component.componentId, ['tab', id]))
		).toBeFalsy();
	});

	it('should set 2nd tab active after clicking it', () => {
		UnitTestHelpers.clickDebugElementById<TabsWrapperComponent>(fixture, idPipe.transform(component.componentId, ['tabs-button', 1]));
		fixture.detectChanges();
		expect(
			UnitTestHelpers.getClassForDebugElementById<TabsWrapperComponent>(
				fixture,
				idPipe.transform(component.componentId, ['tabs-button', 1]),
				'active'
			)
		).toBeTruthy();
	});

	it('should display 2nd tab content after clicking it', () => {
		UnitTestHelpers.clickDebugElementById<TabsWrapperComponent>(fixture, idPipe.transform(component.componentId, ['tabs-button', 1]));
		fixture.detectChanges();
		expect(
			UnitTestHelpers.getDebugElementById<TabsWrapperComponent>(fixture, idPipe.transform(component.componentId, ['tab-2-content']))
		).toBeTruthy();
	});
});
