import {axe, toHaveNoViolations} from 'jest-axe';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObtToursConfig} from '../../lib/models/tour.model';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {HarnessLoader} from '@angular/cdk/testing';
import {ObtTourHarness} from './_harness/tour-menu.harness';
import {ObtTourService} from '../../lib/services/tour.service';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatButtonHarness} from '@angular/material/button/testing';
import {Component, Injector, signal} from '@angular/core';
import {ObtTourComponent} from '../../lib/tour-menu/tour.component';
import {TourPopoverHarness} from './_harness/popover.harness';
import {ObButtonModule} from '@oblique/oblique';
import {MatMenuModule} from '@angular/material/menu';
import {TourPopoverComponent} from '../../lib/tour-menu/tour-popover/tour-popover.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {NgClass} from '@angular/common';

expect.extend(toHaveNoViolations);

const flush = async (fixture: ComponentFixture<any>): Promise<void> => {
	fixture.detectChanges();
	await fixture.whenStable();
	await fixture.whenRenderingDone();
	// eslint-disable-next-line no-promise-executor-return
	await new Promise(resolve => setTimeout(resolve, 50));
};

const config = {
	tours: [
		{
			tourTitle: 'Tour A',
			tourDescription: 'Description A',
			storageKey: 'A',
			steps: [
				{stepTitle: 'A Step 1', stepDescription: 'A Description 1'},
				{stepTitle: 'A Step 2', stepDescription: 'A Description 2'},
				{stepTitle: 'A Step 3', stepDescription: 'A Description 3'},
				{stepTitle: 'A Step 4', stepDescription: 'A Description 4'},
				{stepTitle: 'A Step 5', stepDescription: 'A Description 5'},
				{stepTitle: 'A Step 6', stepDescription: 'A Description 6'}
			]
		},
		{
			tourTitle: 'Tour B',
			tourDescription: 'Description B',
			storageKey: 'B',
			steps: [
				{stepTitle: 'B Step 1', stepDescription: 'B Description 1'},
				{stepTitle: 'B Step 2', stepDescription: 'B Description 2'},
				{stepTitle: 'B Step 3', stepDescription: 'B Description 3'},
				{stepTitle: 'B Step 4', stepDescription: 'B Description 4'}
			]
		},
		{
			tourTitle: 'Tour C',
			tourDescription: 'Description C',
			storageKey: 'C',
			steps: [
				{stepTitle: 'C Step 1', stepDescription: 'C Description 1'},
				{stepTitle: 'C Step 2', stepDescription: 'C Description 2'},
				{stepTitle: 'C Step 3', stepDescription: 'C Description 3'},
				{stepTitle: 'C Step 4', stepDescription: 'C Description 4'}
			]
		}
	]
};

@Component({
	selector: 'obt-tour-menu-test',
	standalone: true,
	imports: [ObtTourComponent],
	template: ` <obt-tour [toursConfig]="tourConfig()" [tourMenuKey]="key" /> `
})
export class TourMenuTestComponent {
	key = 'key-test-123';
	tourConfig = signal<ObtToursConfig>(config);
}
describe('ObtTourComponent (Integration)', () => {
	let fixture: ComponentFixture<TourMenuTestComponent>;
	let loader: HarnessLoader;
	let tourHarness: ObtTourHarness;
	let component: ObtTourComponent;
	let tourMenuTestComponent: TourMenuTestComponent;
	let tourService: ObtTourService;

	beforeAll(() => {
		Object.defineProperty(window, 'getComputedStyle', {
			value: () => ({getPropertyValue: () => ''})
		});
		global.MutationObserver = class {
			// Required because jsdom does not fully implement the native MutationObserver API.
			// Without this mock, Oblique’s icon-button directive throws errors when trying
			// to access aria-describedby attributes that do not exist in the test DOM.
			// This mock safely disables real DOM observation during Jest tests.
			// eslint-disable-next-line @typescript-eslint/no-useless-constructor
			constructor() {}
			observe(): void {}
			disconnect(): void {}
		} as unknown as typeof MutationObserver;
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				TourMenuTestComponent,
				ObtTourComponent,
				BrowserTestingModule,
				TranslateModule.forRoot(),
				ObButtonModule,
				MatButtonModule,
				MatMenuModule,
				MatIconModule,
				MatTooltipModule,
				MatSlideToggleModule,
				TranslatePipe,
				TourPopoverComponent,
				OverlayModule,
				PortalModule,
				NgClass
			],
			providers: [ObtTourService, Injector]
		}).compileComponents();

		tourService = TestBed.inject(ObtTourService);
		jest.spyOn(tourService, 'update');
		fixture = TestBed.createComponent(TourMenuTestComponent);
		tourMenuTestComponent = fixture.componentInstance;
		loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
		tourService.clearLocalStorage();
		await flush(fixture);
		tourHarness = await loader.getHarness(ObtTourHarness);
		component = fixture.debugElement.children[0].componentInstance;
		jest.spyOn(component.tourStatusChanged, 'emit');
	});

	afterEach(() => jest.clearAllMocks());

	describe('Setup & Initialisation', () => {
		it('creates component instance', () => {
			expect(component).toBeTruthy();
		});

		it(`has tourMenuKey to be equal to given key`, () => {
			expect(component.tourMenuKey()).toBe(tourMenuTestComponent.key);
		});

		it('has showTourMenu per default "true"', () => {
			expect(component.showTourMenu).toBe(true);
		});

		it('has isOpen per default "false"', () => {
			expect(component.isOpen()).toBe(false);
		});

		it('has newTours list length equals given tours length of config', () => {
			expect(component.newTours().length).toBe(config.tours.length);
		});

		it('has inProgressTours list length equals 0', () => {
			expect(component.inProgressTours().length).toBe(0);
		});

		it('has skippedTours list length equals 0', () => {
			expect(component.skippedTours().length).toBe(0);
		});
		it('has doneTours list length equals 0', () => {
			expect(component.doneTours().length).toBe(0);
		});

		it('has badgePosition default "right"', () => {
			expect(component.badgePosition()).toBe('right');
		});

		it('has positionX default "auto"', () => {
			expect(component.positionX()).toBe('auto');
		});

		it('has customButtonLabel default to be empty string', () => {
			expect(component.customButtonLabel()).toBe('');
		});

		it('has menuPositions default empty array', () => {
			expect(component.menuPositions()).toEqual([]);
		});

		it('has BADGE_TYPES equals "["new", "inProgress"]"', () => {
			expect((component as any).BADGE_TYPES).toEqual(['new', 'inProgress']);
		});

		it('has toursService to be truthy', () => {
			expect((component as any).toursService).toBeTruthy();
		});

		it('has injector to be truthy', () => {
			expect((component as any).injector).toBeTruthy();
		});

		it('has tourMenuVisibilityService to be truthy', () => {
			expect((component as any).tourMenuVisibilityService).toBeTruthy();
		});

		it('has tourOverlayService to be truthy', () => {
			expect((component as any).tourOverlayService).toBeTruthy();
		});

		it('calls tourService.update() once on init', () => {
			// Force Angular to process inputs and trigger ngOnInit/ngOnChanges
			fixture.componentInstance.tourConfig.set(config);
			expect(tourService.update).toHaveBeenCalledTimes(1);
		});
	});

	describe('Slide toggle', () => {
		it.each([
			{action: 'activate', expected: true},
			{action: 'deactivate', expected: false}
		])('toggles correctly when $action', async ({action, expected}) => {
			if (action === 'activate') {
				await tourHarness.activateToggle();
			} else {
				await tourHarness.deactivateToggle();
			}
			expect(await tourHarness.isToggleChecked()).toBe(expected);
		});

		it('displays correct label text "tour-menu.toggle.label"', async () => {
			const toggle = await tourHarness.getSlideToggleHarness();
			expect(await toggle.getLabelText()).toContain('tour-menu.toggle.label');
		});

		it.each([
			{selector: 'on', key: 'i18n.ob-tour.tour-menu.toggle.tooltip.on'},
			{selector: 'off', key: 'i18n.ob-tour.tour-menu.toggle.tooltip.off'}
		])('renders tooltip "$key" for state "$selector"', async ({key, selector}) => {
			if (selector === 'on') {
				await tourHarness.deactivateToggle();
			} else {
				await tourHarness.activateToggle();
			}
			const tooltip = await loader.getHarness(MatTooltipHarness.with({selector: 'mat-slide-toggle'}));
			await tooltip.show();
			expect(await tooltip.getTooltipText()).toContain(key);
		});
	});

	describe('Notification button', () => {
		it('renders button with aria attribute "aria-haspopup" to be "true"', async () => {
			const button = await loader.getHarness(MatButtonHarness.with({selector: '.obt-notification-button'}));
			const host = await button.host();
			expect(await host.getAttribute('aria-haspopup')).toBe('true');
		});

		it('renders button with aria attribute "aria-expanded" to be "false"', async () => {
			const button = await loader.getHarness(MatButtonHarness.with({selector: '.obt-notification-button'}));
			const host = await button.host();
			expect(await host.getAttribute('aria-expanded')).toBe('false');
		});

		it('shows tooltip when hovered', async () => {
			const tooltip = await loader.getHarness(MatTooltipHarness.with({selector: '.obt-notification-button'}));
			await tooltip.show();
			expect(await tooltip.getTooltipText()).toContain('i18n.ob-tour.tour-menu.popover.open');
		});
	});

	describe('Toggle', () => {
		it('has label "i18n.ob-tour.tour-menu.toggle.label"', async () => {
			const slideToggle = await tourHarness.getSlideToggleHarness();
			const labelText = await slideToggle.getLabelText();
			expect(labelText).toBe('i18n.ob-tour.tour-menu.toggle.label');
		});
		describe('if toggle is unchecked', () => {
			beforeEach(async () => {
				await tourHarness.deactivateToggle();
			});

			it('aria-label-by contains "mat-mdc-slide-toggle"', async () => {
				const slideToggle = await tourHarness.getSlideToggleHarness();
				const ariaLabelText = await slideToggle.getAriaLabelledby();
				expect(ariaLabelText).toContain('mat-mdc-slide-toggle');
			});

			it('has no menu button', async () => {
				const notificationButton = await tourHarness.getNotificationButton();
				expect(await notificationButton?.getText()).toEqual(undefined);
			});
		});

		describe('if toggle is checked', () => {
			beforeEach(async () => {
				await tourHarness.activateToggle();
			});

			it('aria-label-by contains "mat-mdc-slide-toggle"', async () => {
				const slideToggle = await tourHarness.getSlideToggleHarness();
				const ariaLabelText = await slideToggle.getAriaLabelledby();
				expect(ariaLabelText).toContain('mat-mdc-slide-toggle');
			});

			it('has no menu button', async () => {
				const notificationButton = await tourHarness.getNotificationButton();
				expect(await notificationButton?.getText()).toEqual(
					'i18n.ob-tour.tour-menu.popover.icon.book i18n.ob-tour.tour-menu.list.title.dialog :i18n.ob-tour.tour-menu.button.badge.new, i18n.ob-tour.tour-menu.button.badge.in-progress'
				);
			});
		});
	});

	describe('Popover', () => {
		it('click onto menu button opens popover', async () => {
			await tourHarness.closePopover();
			await flush(fixture);
			const notificationButton = await tourHarness.getNotificationButton();
			await notificationButton.click();
			await flush(fixture);
			expect(tourHarness.isPopoverOpen()).toBe(true);
		});

		it('esc closes popover', async () => {
			await tourHarness.openPopover();
			await flush(fixture);
			await tourHarness.pressEscape();
			await flush(fixture);
			expect(tourHarness.isPopoverOpen()).toBe(false);
		});

		it('has MenuLists length of 4', async () => {
			await tourHarness.openPopover();
			await flush(fixture);
			const lists = await tourHarness.getPopoverLists();
			expect(lists.length).toBe(4);
		});

		it('closes popover when escape key is pressed', async () => {
			await tourHarness.openPopover();
			fixture.detectChanges();
			await fixture.whenRenderingDone();

			expect(tourHarness.isPopoverOpen()).toBe(true);
			fixture.detectChanges();
			await fixture.whenRenderingDone();

			await tourHarness.pressEscape();
			fixture.detectChanges();
			await fixture.whenRenderingDone();
			expect(tourHarness.isPopoverOpen()).toBe(false);
		});

		it('renders list titles and elements correctly inside popover', async () => {
			await tourHarness.openPopover();
			const listTitles = await tourHarness.getPopoverListTitles();
			expect(listTitles).toEqual([
				'i18n.ob-tour.tour-menu.list.title.new',
				'i18n.ob-tour.tour-menu.list.title.inProgress',
				'i18n.ob-tour.tour-menu.list.title.done',
				'i18n.ob-tour.tour-menu.list.title.skipped'
			]);
		});
	});

	describe('Badges', () => {
		let popoverHarness: TourPopoverHarness;

		beforeEach(async () => {
			fixture = TestBed.createComponent(TourMenuTestComponent);
			tourService.clearLocalStorage();
			const testComp = fixture.componentRef.instance;
			testComp.tourConfig.set({
				tours: [
					...config.tours,
					{tourTitle: 'anotherTour', tourDescription: 'Fairness', state: 'new', steps: [], storageKey: 'Key2'},
					{tourTitle: 'anotherNewTour', tourDescription: 'FairnessWithNewName', state: 'new', steps: [], storageKey: 'key1'}
				]
			});
			await flush(fixture);
			tourHarness = await loader.getHarness(ObtTourHarness);
			await tourHarness.openPopover();
			await flush(fixture);
			popoverHarness = await tourHarness.getPopoverHarness();
			await tourHarness.activateToggle();
			await flush(fixture);

			const list = await popoverHarness.getMenuListByType('new');
			const start = await list.getActionButtonByNameOrNull('start');
			await start.click();
			await flush(fixture);
		});
		it.each(['new', 'in-progress'])('renders %s badge with correct role status', badgeType => {
			const badge = fixture.nativeElement.querySelector(`#obt-badge-${badgeType}`);
			expect(badge.getAttribute('role')).toBe('status');
		});

		it('updates badge count when service emits new config', async () => {
			let badgeNew = fixture.nativeElement.querySelector('.obt-badge-new');
			expect(badgeNew).not.toBeNull();

			await tourHarness.deactivateToggle();
			fixture.detectChanges();
			await fixture.whenRenderingDone();

			badgeNew = fixture.nativeElement.querySelector('.obt-badge-new');
			expect(badgeNew).toBeNull();
		});
	});

	describe('ARIA roles and labels', () => {
		beforeEach(async () => {
			await tourHarness.activateToggle();
			fixture.detectChanges();
			await fixture.whenRenderingDone();
		});

		it('renders notification container', () => {
			const container = fixture.nativeElement.querySelector('.obt-notification');
			expect(container).not.toBeNull();
		});

		it('notification container has role="group"', () => {
			const container = fixture.nativeElement.querySelector('.obt-notification');
			expect(container.getAttribute('role')).toBe('group');
		});

		it('notification container has correct aria-label', () => {
			const container = fixture.nativeElement.querySelector('.obt-notification');
			expect(container.getAttribute('aria-label')).toBe('i18n.ob-tour.tour-menu.notification.label');
		});
	});

	describe('Edge cases', () => {
		it('handles null config without errors', () => {
			const testComp = fixture.componentInstance;
			expect(() => testComp.tourConfig.set({tours: []})).not.toThrow();
		});

		it('hides notification when showTours is set to false', async () => {
			await tourHarness.deactivateToggle();
			const notification = fixture.nativeElement.querySelector('.obt-notification');
			expect(notification).toBeFalsy();
		});
	});

	describe('Start Tour', () => {
		let popoverHarness: TourPopoverHarness;
		let rootLoader: HarnessLoader;

		beforeEach(async () => {
			tourService.clearLocalStorage();
			fixture.componentInstance.tourConfig.set({
				tours: [
					...config.tours,
					{tourTitle: 'anotherTour', tourDescription: 'Fairness', state: 'new', steps: [], storageKey: 'Key2'},
					{
						tourTitle: '1anotherNewTour',
						tourDescription: '1FairnessWithNewName',
						state: 'new',
						steps: [
							{stepTitle: 'A', stepDescription: ''},
							{stepTitle: 'B', stepDescription: ''},
							{stepTitle: 'C', stepDescription: ''},
							{stepTitle: 'D', stepDescription: ''},
							{stepTitle: 'E', stepDescription: ''},
							{stepTitle: 'F', stepDescription: ''},
							{stepTitle: 'G', stepDescription: ''},
							{stepTitle: 'H', stepDescription: ''}
						],
						storageKey: 'key1'
					},
					{tourTitle: '2anotherNewTour', tourDescription: '2FairnessWithNewName', state: 'new', steps: [], storageKey: 'key3'},
					{tourTitle: '3anotherNewTour', tourDescription: '3FairnessWithNewName', state: 'new', steps: [], storageKey: 'key4'}
				]
			});
			await flush(fixture);
			await tourHarness.activateToggle();
			await flush(fixture);
			await tourHarness.openPopover();
			await flush(fixture);

			rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
			popoverHarness = await rootLoader.getHarness(TourPopoverHarness);
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('has list with 4 new tours', async () => {
			const list = await popoverHarness.getMenuListByType('new');
			expect(await list.getListItemCount()).toBe(4);
		});

		it('has a start buttons in the "new" tours list with label "i18n.ob-tour.tour-menu.list.button.aria.start"', async () => {
			const list = await popoverHarness.getMenuListByType('new');
			const start = await list.getActionButtonByNameOrNull('start');
			expect(await start.getText()).toBe('i18n.ob-tour.tour-menu.list.button.aria.start');
		});
	});

	describe('Start Tour', () => {
		let popoverHarness: TourPopoverHarness;
		let rootLoader: HarnessLoader;

		beforeEach(async () => {
			fixture = TestBed.createComponent(TourMenuTestComponent);
			tourService.clearLocalStorage();

			const testComp = fixture.componentRef.instance;
			testComp.tourConfig.set(config);

			await flush(fixture);

			loader = TestbedHarnessEnvironment.loader(fixture);
			tourHarness = await loader.getHarness(ObtTourHarness);

			await tourHarness.activateToggle();
			await flush(fixture);

			await tourHarness.openPopover();
			await flush(fixture);

			rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
			popoverHarness = await rootLoader.getHarness(TourPopoverHarness);
		});

		afterEach(async () => {
			jest.clearAllMocks();
			fixture.destroy();
			await fixture.whenStable();
		});

		it('shows popover with correct title', async () => {
			await flush(fixture);
			const title = await popoverHarness.getDialogTitle();
			expect(title).toBe('I18n.ob-tour.tour-menu.list.title.dialog');
		});

		it('contains a "new" tours list', async () => {
			await flush(fixture);
			const titles = await popoverHarness.getAllListTitles();
			expect(titles).toContain('i18n.ob-tour.tour-menu.list.title.new');
		});

		it('closes popover after start', async () => {
			fixture.componentInstance.tourConfig.set({
				tours: [
					{
						tourTitle: '1anotherNewTour',
						tourDescription: '1FairnessWithNewName',
						state: 'new',
						steps: [
							{stepTitle: 'A', stepDescription: ''},
							{stepTitle: 'B', stepDescription: ''},
							{stepTitle: 'C', stepDescription: ''},
							{stepTitle: 'D', stepDescription: ''},
							{stepTitle: 'E', stepDescription: ''},
							{stepTitle: 'F', stepDescription: ''},
							{stepTitle: 'G', stepDescription: ''},
							{stepTitle: 'H', stepDescription: ''}
						],
						storageKey: 'key1'
					},
					{
						tourTitle: '1anotherNewTour',
						tourDescription: '1FairnessWithNewName',
						state: 'new',
						steps: [
							{stepTitle: 'A', stepDescription: ''},
							{stepTitle: 'B', stepDescription: ''},
							{stepTitle: 'C', stepDescription: ''},
							{stepTitle: 'D', stepDescription: ''},
							{stepTitle: 'E', stepDescription: ''},
							{stepTitle: 'F', stepDescription: ''},
							{stepTitle: 'G', stepDescription: ''},
							{stepTitle: 'H', stepDescription: ''}
						],
						storageKey: 'key6'
					},
					{
						tourTitle: '1anotherNewTour',
						tourDescription: '1FairnessWithNewName',
						state: 'new',
						steps: [
							{stepTitle: 'A', stepDescription: ''},
							{stepTitle: 'B', stepDescription: ''},
							{stepTitle: 'C', stepDescription: ''},
							{stepTitle: 'D', stepDescription: ''},
							{stepTitle: 'E', stepDescription: ''},
							{stepTitle: 'F', stepDescription: ''},
							{stepTitle: 'G', stepDescription: ''},
							{stepTitle: 'H', stepDescription: ''}
						],
						storageKey: 'key1'
					},
					{
						tourTitle: '1anotherNewTour',
						tourDescription: '1FairnessWithNewName',
						state: 'new',
						steps: [
							{stepTitle: 'A', stepDescription: ''},
							{stepTitle: 'B', stepDescription: ''},
							{stepTitle: 'C', stepDescription: ''},
							{stepTitle: 'D', stepDescription: ''},
							{stepTitle: 'E', stepDescription: ''},
							{stepTitle: 'F', stepDescription: ''},
							{stepTitle: 'G', stepDescription: ''},
							{stepTitle: 'H', stepDescription: ''}
						],
						storageKey: 'key1'
					}
				]
			});
			await flush(fixture);
			const list = await popoverHarness.getMenuListByType('new');
			const start = await list.getActionButtonByNameOrNull('start');
			await (await start.host()).click();

			await flush(fixture);
			expect(tourHarness.isPopoverOpen()).toBe(false);
		});
	});
	describe('Accessibility', () => {
		it('should have no accessibility violations in default state', async () => {
			const results = await axe(fixture.nativeElement);
			expect(results).toHaveNoViolations();
		});

		it('should have no accessibility violations with popover open', async () => {
			await tourHarness.activateToggle();
			await tourHarness.openPopover();
			fixture.detectChanges();
			await fixture.whenRenderingDone();

			const results = await axe(fixture.nativeElement);
			expect(results).toHaveNoViolations();
		});

		it('should have no accessibility violations when toggle is deactivated', async () => {
			await tourHarness.deactivateToggle();
			fixture.detectChanges();
			await fixture.whenRenderingDone();

			const results = await axe(fixture.nativeElement);
			expect(results).toHaveNoViolations();
		});
	});
});
