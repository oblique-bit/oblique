import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {MatSlideToggleHarness} from '@angular/material/slide-toggle/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {ObTourServiceMock} from '../lib/services/_mock/tour-mock.service';
import {ObtTourService} from '../lib/services/tour.service';
import type {ObTourConfig, ObtToursConfig} from '../lib/models/tour-config.model';
import {ObtTourMenuComponent} from '../lib/tour-menu/tour-menu.component';
import {ObtTourMenuHarness} from './_harness/tour-menu.harness';
import {MAT_TOOLTIP_DEFAULT_OPTIONS} from '@angular/material/tooltip';

@Component({
	selector: 'obt-tour-menu-test',
	imports: [ObtTourMenuComponent],
	template: '<obt-tour-menu [toursConfig]="tourConfig" />'
})
class TourMenuTestComponent {
	tourConfig: ObtToursConfig = {
		tours: [
			{
				tourTitle: 'Tour A',
				tourDescription: 'Description A',
				state: 'new',
				triggers: [{type: 'manual'}],
				storageKey: 'A',
				steps: [{stepTitle: 'step1', stepDescription: 'desc1'}]
			},
			{
				tourTitle: 'Tour B',
				tourDescription: 'Description B',
				state: 'inProgress',
				triggers: [{type: 'manual'}],
				storageKey: 'B',
				steps: [{stepTitle: 'step1', stepDescription: 'desc1'}]
			},
			{
				tourTitle: 'Tour C',
				tourDescription: 'Description C',
				state: 'done',
				triggers: [{type: 'manual'}],
				storageKey: 'C',
				steps: [{stepTitle: 'step1', stepDescription: 'desc1'}]
			}
		]
	};
}

describe('TourMenuComponent (Integration)', () => {
	let fixture: ComponentFixture<TourMenuTestComponent>;
	let loader: HarnessLoader;
	let component: ObtTourMenuComponent;
	let tourService: ObtTourService;

	beforeAll(() => {
		Object.defineProperty(window, 'getComputedStyle', {
			value: () => ({
				getPropertyValue: () => ''
			})
		});
	});
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObtTourMenuComponent, TourMenuTestComponent, BrowserTestingModule, TranslateModule.forRoot()]
		}).compileComponents();
		tourService = TestBed.inject(ObtTourService);
		jest.spyOn(tourService, 'init');
		fixture = TestBed.createComponent(TourMenuTestComponent);
		fixture.detectChanges();
		const debug = fixture.debugElement.children[0];
		component = debug.componentInstance;
		loader = TestbedHarnessEnvironment.loader(fixture);
		fixture.detectChanges();
	});

	describe('Component setup', () => {
		it('creates the component', () => {
			expect(component).toBeTruthy();
		});

		it('calls ObTourService.init() once during setup', () => {
			expect(tourService.init).toHaveBeenCalledTimes(2);
		});
	});

	describe('Slide toggle behaviour', () => {
		let toggle: MatSlideToggleHarness;

		beforeEach(async () => {
			toggle = await loader.getHarness(MatSlideToggleHarness);
		});

		it('renders slide toggle with correct label', async () => {
			const label = await toggle.getLabelText();
			expect(label).toContain('tour-menu.toggle.label');
		});

		it('initially sets showTours to true', async () => {
			const isChecked = await toggle.isChecked();
			expect(isChecked).toBe(true);
		});

		it('updates showTours to false when toggled off', async () => {
			await toggle.toggle();
			expect(component.showTours()).toBe(false);
		});

		it('updates showTours back to true when toggled on again', async () => {
			await toggle.toggle();
			await toggle.toggle();
			expect(component.showTours()).toBe(true);
		});
	});

	describe('Popover behaviour', () => {
		let button: MatButtonHarness;

		beforeEach(async () => {
			button = await loader.getHarness(MatButtonHarness.with({selector: '.obt-notification-button'}));
		});

		it('toggles isOpen to true after click', async () => {
			await button.click();
			expect(component.isOpen()).toBe(true);
		});

		it('sets isOpen to false after calling closePopover()', () => {
			component.isOpen.set(true);
			component.closePopover();
			expect(component.isOpen()).toBe(false);
		});
	});

	describe('Badges', () => {
		it('renders correct badge count for new tours', () => {
			fixture.detectChanges();
			const badge = fixture.nativeElement.querySelector('.obt-badge-new');
			expect(badge?.textContent.trim()).toBe('1  i18n.ob-tour.tour-menu.button.badge.screen-reader.new.one');
		});

		it('renders correct badge count for in-progress tours', () => {
			fixture.detectChanges();
			const badge = fixture.nativeElement.querySelector('.obt-badge-in-progress');
			expect(badge?.textContent.trim()).toBe('1  i18n.ob-tour.tour-menu.button.badge.screen-reader.in-progress.one');
		});
	});
});

describe('TourMenuComponent (Integration via Harness)', () => {
	let fixture: ComponentFixture<TourMenuTestComponent>;
	let loader: HarnessLoader;
	let harness: ObtTourMenuHarness;
	let component: ObtTourMenuComponent;
	let serviceMock: ObTourServiceMock;
	let tooltips: MatTooltipHarness[];

	beforeEach(async () => {
		serviceMock = new ObTourServiceMock();

		await TestBed.configureTestingModule({
			imports: [ObtTourMenuComponent, TourMenuTestComponent, BrowserTestingModule, TranslateModule.forRoot()],
			providers: [
				{
					provide: ObtTourService,
					useValue: serviceMock
				},
				{
					provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
					useValue: {
						showDelay: 0,
						hideDelay: 0,
						touchendHideDelay: 0,
						disableTooltipInteractivity: true
					}
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(TourMenuTestComponent);
		loader = TestbedHarnessEnvironment.loader(fixture);
		harness = await loader.getHarness(ObtTourMenuHarness);
		const debug = fixture.debugElement.children[0];
		component = debug.componentInstance;
		tooltips = await loader.getAllHarnesses(MatTooltipHarness);
		fixture.detectChanges();
	});

	describe('Structure & setup', () => {
		it('creates component', () => {
			expect(component).toBeTruthy();
		});

		it('renders harness host', () => {
			expect(harness).toBeTruthy();
		});
	});

	describe('Slide toggle via harness', () => {
		describe('visibility off', () => {
			it('first toggle toggles off', async () => {
				await harness.toggleOverviewVisibility();
				expect(await harness.isToggleChecked()).toBe(false);
			});

			it('menuButton is not visible anymore', async () => {
				await harness.deactivateToggle();
				expect(await harness.getNotificationButton()).toBe(null);
			});

			it('menu button displays a tooltip', async () => {
				await harness.activateToggle();
				fixture.detectChanges();

				const matTooltipHarnesses = await loader.getAllHarnesses(MatTooltipHarness);
				expect(matTooltipHarnesses.length).toBeGreaterThan(0);

				await matTooltipHarnesses[0].show();
				const tooltipText = await matTooltipHarnesses[0].getTooltipText();
				expect(tooltipText.trim().length).toBeGreaterThan(0);
			});
		});

		it('toggles visibility on again', async () => {
			await harness.toggleOverviewVisibility();
			await harness.toggleOverviewVisibility();
			expect(await harness.isToggleChecked()).toBe(true);
		});
	});

	describe('Popover via harness', () => {
		it('opens popover on button click', async () => {
			await harness.openPopover();
			expect(harness.isPopoverOpen()).toBe(true);
		});

		it('closes popover via closePopover()', async () => {
			await harness.openPopover();
			await harness.closePopover();
			fixture.detectChanges();
			await fixture.whenStable();
			expect(harness.isPopoverOpen()).toBe(false);
		});
	});

	describe('Buttons & icons', () => {
		it('renders menu button', async () => {
			await harness.activateToggle();
			fixture.detectChanges();
			const buttons = await harness.getNotificationButton();
			expect(await buttons.getText()).toBe(
				'i18n.ob-tour.tour-menu.popover.icon.book  i18n.ob-tour.tour-menu.list.title.dialog  :i18n.ob-tour.tour-menu.button.badge.new, i18n.ob-tour.tour-menu.button.badge.in-progress'
			);
		});

		it('menu button has correct tooltip text', async () => {
			await harness.activateToggle();
			const tooltipHarness = await loader.getHarness(MatTooltipHarness.with({selector: '.obt-notification-button'}));
			await tooltipHarness.show();
			const tooltipText = await tooltipHarness.getTooltipText();
			expect(tooltipText).toContain('i18n.ob-tour.tour-menu.popover.open');
		});

		it('renders icons', async () => {
			const icons = await harness.getIcons();
			expect(icons.length).toBeGreaterThan(0);
		});
	});

	describe('Tooltips', () => {
		it('renders tooltip directive with text i18n.ob-tour.tour-menu.toggle.tooltip.on', async () => {
			await harness.deactivateToggle();
			fixture.detectChanges();
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			const filtered = tooltips.find(async tooltip => {
				const text = await tooltip.getTooltipText();
				return text === 'i18n.ob-tour.tour-menu.toggle.tooltip.on';
			});
			await filtered.show();
			expect(await filtered.getTooltipText()).toContain('i18n.ob-tour.tour-menu.toggle.tooltip.on');
		});

		it('renders tooltip directive with text i18n.ob-tour.tour-menu.toggle.tooltip.off', async () => {
			await harness.activateToggle();
			fixture.detectChanges();
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			const filtered = tooltips.find(async tooltip => {
				const text = await tooltip.getTooltipText();
				return text === 'i18n.ob-tour.tour-menu.toggle.tooltip.off';
			});
			await filtered.show();
			expect(await filtered.getTooltipText()).toContain('i18n.ob-tour.tour-menu.toggle.tooltip.off');
		});
	});

	describe('ARIA & Accessibility', () => {
		beforeEach(async () => {
			await harness.activateToggle();
			fixture.detectChanges();
		});

		describe('Notification button attributes', () => {
			let button: MatButtonHarness;
			let host: any;

			beforeEach(async () => {
				button = await loader.getHarness(MatButtonHarness.with({selector: '.obt-notification-button'}));
				host = await button.host();
			});

			it('has aria-haspopup set to true', async () => {
				const attr = await host.getAttribute('aria-haspopup');
				expect(attr).toBe('true');
			});

			it('sets aria-expanded to true when popover opens', async () => {
				await button.click();
				expect(await host.getAttribute('aria-expanded')).toBe('true');
			});

			it('sets aria-expanded to false when popover closes', async () => {
				await button.click(); // open
				component.closePopover(); // close manually
				fixture.detectChanges();
				expect(await host.getAttribute('aria-expanded')).toBe('false');
			});
		});

		describe('Notification container', () => {
			it('renders the container element', () => {
				const element = fixture.nativeElement.querySelector('.obt-notification');
				expect(element).toBeTruthy();
			});

			it('has role="group"', () => {
				const element = fixture.nativeElement.querySelector('.obt-notification');
				expect(element.getAttribute('role')).toBe('group');
			});

			it('contains an aria-label with translated text', () => {
				const element = fixture.nativeElement.querySelector('.obt-notification');
				const label = element.getAttribute('aria-label');
				expect(label).toBe('i18n.ob-tour.tour-menu.notification.label');
			});
		});

		describe('Badges', () => {
			beforeEach(() => {
				const tours: ObTourConfig[] = [
					{
						tourTitle: 'Tour new 1',
						tourDescription: 'Desc new 1',
						state: 'new',
						triggers: [{type: 'manual'}],
						storageKey: 'A',
						steps: [{stepTitle: 'step1', stepDescription: 'desc1'}]
					},
					{
						tourTitle: 'Tour inProgress 1',
						tourDescription: 'Desc progress 1',
						state: 'inProgress',
						triggers: [{type: 'manual'}],
						storageKey: 'B',
						steps: [{stepTitle: 'step1', stepDescription: 'desc1'}]
					}
				];
				fixture.componentRef.setInput('toursConfig', {tours});
				fixture.detectChanges();
			});

			it('renders the new badge', () => {
				const badge = fixture.nativeElement.querySelector('#obt-badge-new');
				expect(badge).toBeTruthy();
			});

			it('renders the in-progress badge', () => {
				const badge = fixture.nativeElement.querySelector('#obt-badge-in-progress');
				expect(badge).toBeTruthy();
			});

			it('sets role="status" on new badge', () => {
				const badge = fixture.nativeElement.querySelector('#obt-badge-new');
				expect(badge.getAttribute('role')).toBe('status');
			});

			it('sets role="status" on in-progress badge', () => {
				const badge = fixture.nativeElement.querySelector('#obt-badge-in-progress');
				expect(badge.getAttribute('role')).toBe('status');
			});

			it('displays correct count in new badge', () => {
				const badge = fixture.nativeElement.querySelector('#obt-badge-new');
				expect(badge.textContent.trim()).toContain('1');
			});

			it('displays correct count in in-progress badge', () => {
				const badge = fixture.nativeElement.querySelector('#obt-badge-in-progress');
				expect(badge.textContent.trim()).toContain('1');
			});

			it('renders .ob-screen-reader-only inside new badge', () => {
				const element = fixture.nativeElement.querySelector('#obt-badge-new .ob-screen-reader-only');
				expect(element).toBeTruthy();
			});

			it('renders .ob-screen-reader-only inside in-progress badge', () => {
				const element = fixture.nativeElement.querySelector('#obt-badge-in-progress .ob-screen-reader-only');
				expect(element).toBeTruthy();
			});
		});

		describe('Notification button', () => {
			let button: HTMLButtonElement;

			beforeEach(() => {
				button = fixture.nativeElement.querySelector('.obt-notification-button');
			});

			it('renders the button element', () => {
				expect(button).toBeTruthy();
			});

			it('has type="button"', () => {
				expect(button.type).toBe('button');
			});

			it('has aria-haspopup="true"', () => {
				expect(button.getAttribute('aria-haspopup')).toBe('true');
			});

			it('has aria-describedby="obt-notification-button-label"', () => {
				expect(button.getAttribute('aria-describedby')).toContain('obt-notification-button-label cdk-describedby-message');
			});

			it('has aria-expanded="false" by default', () => {
				expect(button.getAttribute('aria-expanded')).toBe('false');
			});

			it('toggles aria-expanded to true after opening popover', () => {
				component.togglePopover(new MouseEvent('click'));
				fixture.detectChanges();
				expect(button.getAttribute('aria-expanded')).toBe('true');
			});

			it('renders the button label element', () => {
				const label = fixture.nativeElement.querySelector('#obt-notification-button-label');
				expect(label).toBeTruthy();
			});

			it('renders a .obt-screen-reader-only inside the button label', () => {
				const label = fixture.nativeElement.querySelector('#obt-notification-button-label');
				const hidden = label.querySelector('.obt-screen-reader-only');
				expect(hidden).toBeTruthy();
			});

			it('screen-reader label text references both badges', () => {
				const hidden = fixture.nativeElement.querySelector('#obt-notification-button-label .obt-screen-reader-only');
				expect(hidden.textContent).toContain('tour-menu.button.badge.new');
				expect(hidden.textContent).toContain('tour-menu.button.badge.in-progress');
			});

			it('shows tooltip with translated label when hovered', async () => {
				const tooltipHarness = await loader.getHarness(MatTooltipHarness.with({selector: '.obt-notification-button'}));
				await tooltipHarness.show();
				const tooltipText = await tooltipHarness.getTooltipText();
				expect(tooltipText).toContain('i18n.ob-tour.tour-menu.popover.open');
			});
		});
	});
});
