import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IdPipe} from '../../shared/id/id.pipe';
import {AccordionLinksComponent} from './accordion-links.component';
import {Accordion} from './accordion-links.model';
import {UnitTestHelpers} from '../../../test-helpers/unit-test-helpers/unit-test-helpers';

describe(`${AccordionLinksComponent.name}`, () => {
	let component: AccordionLinksComponent;
	let fixture: ComponentFixture<AccordionLinksComponent>;
	const idPipe = new IdPipe();

	const accordionLinksBeforeEach = async (accordions: Accordion[]): Promise<any> => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, AccordionLinksComponent, IdPipe]
		}).compileComponents();

		fixture = TestBed.createComponent(AccordionLinksComponent);
		component = fixture.componentInstance;
		component.accordions = accordions;
		component.ngOnInit();
		component.ngOnChanges({accordions: {previousValue: {}, currentValue: {}, firstChange: false, isFirstChange: () => false}});
		fixture.autoDetectChanges();
		return fixture.whenStable();
	};

	beforeEach(async () => {
		await accordionLinksBeforeEach([
			{
				id: 'Component',
				links: [],
				title: 'Components'
			},
			{
				id: 'Guideline',
				links: [
					{
						id: 2,
						minVersion: 1,
						slug: 'guideline-sub-item-1',
						title: 'Guideline Sub Item #1'
					}
				],
				title: 'Guidelines'
			},
			{
				id: 'Introduction',
				links: [
					{
						id: 1,
						minVersion: 1,
						slug: 'introduction-sub-item-2',
						title: 'Introduction Sub Item # 1'
					},
					{
						id: 3,
						minVersion: 1,
						slug: 'introduction-sub-item-2',
						title: 'Introduction Sub Item #2'
					}
				],
				title: 'Introductions'
			}
		]);
	});

	afterEach(() => {
		fixture?.destroy();
	});

	it.each<{index: number}>([{index: 0}, {index: 1}, {index: 2}])('should display accordion at: $index', ({index}) => {
		expect(
			UnitTestHelpers.getDebugElementById<AccordionLinksComponent>(
				fixture,
				idPipe.transform(component.idPrefix, [component.componentId, 'triangle', index])
			)
		).toBeTruthy();
	});

	it.each<{index: number}>([{index: 3}, {index: 4}, {index: 5}])('should not display accordion at: $index', ({index}) => {
		expect(
			UnitTestHelpers.getDebugElementById<AccordionLinksComponent>(
				fixture,
				idPipe.transform(component.idPrefix, [component.componentId, 'triangle', index])
			)
		).toBeFalsy();
	});

	it.each<{indexes: number[]}>([{indexes: [1, 0]}, {indexes: [2, 0]}, {indexes: [2, 1]}])('should display link at: $index', ({indexes}) => {
		expect(
			UnitTestHelpers.getDebugElementById<AccordionLinksComponent>(
				fixture,
				idPipe.transform(component.idPrefix, [component.componentId, 'link', ...indexes])
			)
		).toBeTruthy();
	});

	it.each<{indexes: number[]}>([{indexes: [0, 0]}, {indexes: [2, 2]}, {indexes: [3, 0]}])(
		'should not display link at: $index',
		({indexes}) => {
			expect(
				UnitTestHelpers.getDebugElementById<AccordionLinksComponent>(
					fixture,
					idPipe.transform(component.idPrefix, [component.componentId, 'link', ...indexes])
				)
			).toBeFalsy();
		}
	);

	it.each<{indexes: number[]; accordionName: string}>([
		{indexes: [2, 0], accordionName: 'Introduction'},
		{indexes: [2, 1], accordionName: 'Introduction'}
	])(`should have accordion at: $index ($accordionName) expanded`, ({indexes}) => {
		expect(
			UnitTestHelpers.getClassForDebugElementById<AccordionLinksComponent>(
				fixture,
				idPipe.transform(component.idPrefix, [component.componentId, 'link', ...indexes]),
				'hidden'
			)
		).toBeFalsy();
	});

	it.each<{index: number; direction: 'down' | 'right'}>([
		{index: 0, direction: 'right'},
		{index: 1, direction: 'right'},
		{index: 2, direction: 'right'}
	])(`should not have triangle pointing $direction for accordion at: $index`, ({index, direction}) => {
		expect(
			UnitTestHelpers.getClassForDebugElementById<AccordionLinksComponent>(
				fixture,
				idPipe.transform(component.idPrefix, [component.componentId, 'triangle', index]),
				`triangle-pointing-${direction}`
			)
		).toBeFalsy();
	});

	it.each<{index: number; direction: 'down' | 'right'}>([
		{index: 0, direction: 'down'},
		{index: 1, direction: 'down'},
		{index: 2, direction: 'down'}
	])(`should have triangle pointing $direction for accordion at: $index`, ({index, direction}) => {
		expect(
			UnitTestHelpers.getClassForDebugElementById<AccordionLinksComponent>(
				fixture,
				idPipe.transform(component.idPrefix, [component.componentId, 'triangle', index]),
				`triangle-pointing-${direction}`
			)
		).toBeTruthy();
	});
});
