import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {TranslateModule, provideTranslateService} from '@ngx-translate/core';
import {HarnessLoader, TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ObTourStep, ObTourTrigger, ObtTourMenuComponent, ObtToursConfig} from '../public-api';
import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {dasherize} from '@angular-devkit/core/src/utils/strings';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';

import {ObtTourMenuHarness} from './_harness/tour-menu.harness';
import {ObTourConfig, ObTourState} from '../lib/models/tour-config.model';

@Component({
	selector: 'obt-integration-test',
	standalone: true,
	imports: [ObtTourMenuComponent, MatCardModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatIconModule],
	template: `
		<obt-tour-menu [toursConfig]="toursConfig" />

		<section class="demo-area" aria-label="Demo section for tour steps">
			<mat-card appearance="outlined">
				<mat-card-header>
					<mat-card-title>Demo: User Settings</mat-card-title>
					<mat-card-subtitle>Tour example area</mat-card-subtitle>
				</mat-card-header>

				<mat-card-content>
					<form>
						<mat-form-field appearance="outline">
							<mat-label>First name</mat-label>
							<input matInput id="demo-input-firstname" placeholder="Enter your first name" />
						</mat-form-field>

						<mat-form-field appearance="outline">
							<mat-label>Email</mat-label>
							<input matInput id="demo-input-email" type="email" placeholder="name@example.com" />
						</mat-form-field>

						<div class="demo-buttons">
							<button type="button" mat-raised-button color="primary" id="demo-btn-save" matTooltip="Save current settings">
								<mat-icon>save</mat-icon>
								Save
							</button>

							<button type="button" mat-stroked-button id="demo-btn-cancel" matTooltip="Cancel changes">
								<mat-icon>close</mat-icon>
								Cancel
							</button>
						</div>
					</form>
				</mat-card-content>
			</mat-card>

			<mat-card appearance="outlined">
				<mat-card-header>
					<mat-card-title>Tour Info Panel</mat-card-title>
				</mat-card-header>
				<mat-card-content>
					<p id="demo-panel-info">This panel contains extra info for testing overlay tours.</p>
					<button type="button" mat-flat-button color="accent" id="demo-btn-open-panel" matTooltip="Open additional panel">
						Open Panel
					</button>
				</mat-card-content>
			</mat-card>
		</section>
	`,
	styles: [
		`
			.demo-area {
				display: flex;
				flex-direction: column;
				gap: 2rem;
				padding: 2rem;
			}

			form {
				display: flex;
				flex-direction: column;
				gap: 1.5rem;
			}

			.demo-buttons {
				display: flex;
				gap: 1rem;
			}

			mat-card {
				max-width: 600px;
			}
		`
	]
})
class ObtIntegrationTestComponent {
	types: ObTourState[] = ['new', 'inProgress', 'done'];
	toursConfig: ObtToursConfig;
}

describe('Integration: Tour Feature', () => {
	let fixture: ComponentFixture<ObtIntegrationTestComponent>;
	let loader: HarnessLoader;
	let component: ObtIntegrationTestComponent;

	beforeEach(async () => {
		const translateTestConfig = {
			locales: ['en'],
			defaultLanguage: 'en',
			useDefaultLang: true
		};
		await TestBed.configureTestingModule({
			imports: [ObtIntegrationTestComponent, ObtTourMenuComponent, TranslateModule.forRoot()],
			providers: [provideTranslateService(translateTestConfig)]
		}).compileComponents();
		fixture = TestBed.createComponent(ObtIntegrationTestComponent);
		component = fixture.componentInstance;

		const tourStates: ObTourState[] = ['new', 'inProgress', 'done'];

		component.toursConfig = {
			tours: tourStates.flatMap(state =>
				createList(
					// eslint-disable-next-line @typescript-eslint/naming-convention,id-length
					Array.from({length: 2}, (_, index) => ({
						idKey: `${state}-tour-${index + 1}`,
						type: state
					}))
				)
			)
		};

		loader = TestbedHarnessEnvironment.loader(fixture);
		fixture.detectChanges();
	});

	describe('Component creation', () => {
		it('should create integration component', () => {
			expect(component).toBeTruthy();
		});

		it('should render TourMenuComponent inside host', async () => {
			const tourMenuComponent = await loader.getHarness(ObtTourMenuHarness);
			expect(tourMenuComponent).toBeTruthy();
		});
	});

	describe('TourMenu interactions', () => {
		describe('Switch toggle', () => {
			describe.each([
				{
					toggleAction: undefined,
					descriptionState: 'default',
					actionDescription: 'by default',
					expectedChecked: true,
					expectShowNotificationButton: true,
					tooltipLabelKey: 'i18n.ob-tour.tour-menu.toggle.tooltip.off'
				},
				{
					toggleAction: false,
					descriptionState: 'close',
					actionDescription: 'by toggle switch off ',
					expectedChecked: false,
					expectShowNotificationButton: false,
					tooltipLabelKey: 'i18n.ob-tour.tour-menu.toggle.tooltip.on'
				},
				{
					toggleAction: true,
					descriptionState: 'open',
					actionDescription: 'by toggle switch on ',
					expectedChecked: true,
					expectShowNotificationButton: true,
					tooltipLabelKey: 'i18n.ob-tour.tour-menu.toggle.tooltip.off'
				}
			])(
				`checked state $actionDescription`,
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				({toggleAction, descriptionState, actionDescription, expectedChecked, expectShowNotificationButton, tooltipLabelKey}) => {
					let obtTourMenuHarness: ObtTourMenuHarness;
					beforeEach(async () => {
						obtTourMenuHarness = await loader.getHarness(ObtTourMenuHarness);
						if (toggleAction === undefined) {
							return;
						}
						await (toggleAction ? obtTourMenuHarness.activateToggle() : obtTourMenuHarness.deactivateToggle());
						fixture.detectChanges();
					});

					it(`should have state ${expectedChecked ? 'checked' : 'unchecked'}`, async () => {
						expect(await obtTourMenuHarness.isToggleChecked()).toBe(expectedChecked);
					});

					it(`should ${expectedChecked ? 'show' : 'hide'} menu button`, async () => {
						const menuButton = await obtTourMenuHarness.getNotificationButton();
						const menuButtonHost = await menuButton?.host();
						if (expectShowNotificationButton) {
							expect(menuButtonHost).toBeTruthy();
						} else {
							expect(menuButtonHost).toBeFalsy();
						}
					});

					it(`should have label that is i18n.ob-tour.tour-menu.toggle.label`, async () => {
						const toggleHarness = await obtTourMenuHarness.getSlideToggleHarness();
						expect(await toggleHarness.getLabelText()).toBe('i18n.ob-tour.tour-menu.toggle.label');
					});

					it(`should have getAriaLabelledby equal mat-mdc-slide-toggle-XXX-label`, async () => {
						const toggleHarness = await obtTourMenuHarness.getSlideToggleHarness();
						expect(await toggleHarness.getAriaLabelledby()).toContain('mat-mdc-slide-toggle-');
					});

					it(`should have matTooltip to be ${tooltipLabelKey}`, async () => {
						const tooltipHarness = await loader.getHarness(MatTooltipHarness.with({selector: 'mat-slide-toggle'}));
						await tooltipHarness.show();
						const tooltipText = (await tooltipHarness.getTooltipText()).replace(/\s+/g, ' ').trim();
						expect(tooltipText).toContain(tooltipLabelKey);
					});
				}
			);
		});

		describe('Notification', () => {
			let tourMenuHarness: ObtTourMenuHarness;
			let notificationContainer: TestElement;
			beforeEach(async () => {
				tourMenuHarness = await loader.getHarness(ObtTourMenuHarness);
				notificationContainer = await tourMenuHarness.getNotificationContainer();
			});

			it('should have notificationContainer with role group', async () => {
				expect(await notificationContainer.getAttribute('role')).toBe('group');
			});

			it('should have notificationContainer with aria-label', async () => {
				expect(await notificationContainer.getAttribute('aria-label')).toBe('i18n.ob-tour.tour-menu.notification.label');
			});

			describe('Notification button', () => {
				it('should have menu-button', async () => {
					const menuButton = await tourMenuHarness.getNotificationButton();
					expect(await menuButton.host()).toBeTruthy();
				});

				it('should have menu-button with correct text ', async () => {
					const menuButton = await tourMenuHarness.getNotificationButton();
					expect(await menuButton.getText()).toBe(
						'i18n.ob-tour.tour-menu.popover.icon.book  i18n.ob-tour.tour-menu.list.title.dialog  :i18n.ob-tour.tour-menu.button.badge.new, i18n.ob-tour.tour-menu.button.badge.in-progress'
					);
				});

				describe('click', () => {
					let obtTourMenuHarness: ObtTourMenuHarness;
					beforeEach(async () => {
						obtTourMenuHarness = await loader.getHarness(ObtTourMenuHarness);
					});

					it('should open popover', async () => {
						await obtTourMenuHarness.openPopover();
						expect(obtTourMenuHarness.isPopoverOpen()).toBe(true);
					});

					it('should close popover', async () => {
						await obtTourMenuHarness.closePopover();
						expect(obtTourMenuHarness.isPopoverOpen()).toBe(false);
					});
				});
			});

			describe('Badges', () => {
				let obtTourMenuHarness: ObtTourMenuHarness;

				beforeEach(async () => {
					obtTourMenuHarness = await loader.getHarness(ObtTourMenuHarness);
				});

				describe.each([
					{
						state: 'new',
						getBadge: async () => obtTourMenuHarness.getBadgeNewOrNull(),
						tooltipKeyBase: `i18n.ob-tour.tour-menu.button.badge.screen-reader`
					},
					{
						state: 'inProgress',
						getBadge: async () => obtTourMenuHarness.getBadgeInProgressOrNull(),
						tooltipKeyBase: `i18n.ob-tour.tour-menu.button.badge.screen-reader`
					}
				])('$state', ({state, getBadge, tooltipKeyBase}) => {
					it('have role status', async () => {
						const badge = await getBadge();
						const role = await badge.getAttribute('role');
						expect(role).toBe('status');
					});

					describe.each([
						{description: 'With 0 tours', tourCount: 0, expectedVisible: false},
						{description: 'With 1 tour', tourCount: 1, expectedVisible: true},
						{description: 'With 2 tours', tourCount: 2, expectedVisible: true},
						{description: 'With 3 tours', tourCount: 3, expectedVisible: true}
					])('$description', ({tourCount, expectedVisible}) => {
						let badgeElement: TestElement | null;
						let expectedText: string | null;
						let expectedTooltipKey: string;
						let expectedTextKey: string;

						beforeEach(async () => {
							component.toursConfig = {
								tours: createList(
									// eslint-disable-next-line @typescript-eslint/naming-convention,id-length
									Array.from({length: tourCount}, (_, index) => ({
										idKey: `${state}-tour-${index + 1}`,
										type: state as any
									}))
								)
							};

							badgeElement = await getBadge();

							if (tourCount === 0) {
								expectedText = null;
								expectedTooltipKey = '';
								expectedTextKey = '';
								return;
							}

							const suffix = tourCount === 1 ? 'one' : 'other';
							expectedTooltipKey = `${tooltipKeyBase}.${dasherize(state)}.${suffix}`;
							expectedTextKey = `${tooltipKeyBase}.${dasherize(state)}.${suffix}`;
							expectedText = `${tourCount} ${expectedTextKey}`;
						});

						afterEach(() => {
							component.toursConfig = {tours: []};
							fixture.detectChanges();
						});

						it(`should ${expectedVisible ? '' : 'not '}display ${state} badge`, () => {
							expect(!!badgeElement).toBe(expectedVisible);
						});

						it(`should ${expectedVisible ? 'show correct count and key' : 'not contain text'} for ${state} badge`, async () => {
							if (!expectedVisible) {
								expect(badgeElement).toBeFalsy();
								return;
							}
							const normalized = (await badgeElement?.text())?.replace(/\s+/g, ' ').trim();
							expect(normalized).toBe(expectedText);
						});

						it(`should ${expectedVisible ? 'have tooltip' : 'not have tooltip'} for ${state} badge`, async () => {
							const selector = `.obt-badge-${state === 'inProgress' ? 'in-progress' : 'new'}`;
							if (!expectedVisible) {
								const maybeTooltip = await loader.getHarnessOrNull(MatTooltipHarness.with({selector}));
								expect(maybeTooltip).toBe(null);
								return;
							}

							const tooltipHarness = await loader.getHarness(MatTooltipHarness.with({selector}));
							await tooltipHarness.show();
							const tooltipText = (await tooltipHarness.getTooltipText()).replace(/\s+/g, ' ').trim();

							expect(tooltipText).toContain(expectedTooltipKey);
						});
					});
				});
			});
		});

		describe('TourPopover', () => {
			let tourMenuHarness: ObtTourMenuHarness;
			let popover: TestElement | null;

			beforeEach(async () => {
				tourMenuHarness = await loader.getHarness(ObtTourMenuHarness);
				await tourMenuHarness.openPopover();
				fixture.detectChanges();
				popover = await tourMenuHarness.getPopoverElement();
			});

			afterEach(async () => {
				await tourMenuHarness.closePopover();
			});

			it('should render popover when opened', () => {
				expect(popover).toBeTruthy();
			});

			it('should set isPopoverOpen() to true after opening', () => {
				expect(tourMenuHarness.isPopoverOpen()).toBe(true);
			});

			it('should contain new tours list title', async () => {
				const lists = await tourMenuHarness.getPopoverLists();
				const titles = await Promise.all(lists.map(list => list.getListTitleText()));
				expect(titles.join(' ')).toContain('i18n.ob-tour.tour-menu.list.title.new');
			});

			it('should contain inProgress tours list title', async () => {
				const lists = await tourMenuHarness.getPopoverLists();
				const titles = await Promise.all(lists.map(list => list.getListTitleText()));
				expect(titles.join(' ')).toContain('i18n.ob-tour.tour-menu.list.title.inProgress');
			});

			it('should contain done tours list title', async () => {
				const lists = await tourMenuHarness.getPopoverLists();
				const titles = await Promise.all(lists.map(list => list.getListTitleText()));
				expect(titles.join(' ')).toContain('i18n.ob-tour.tour-menu.list.title.done');
			});

			it('should have a close button inside the popover', async () => {
				const closeButton = await tourMenuHarness.getPopoverCloseButton();
				expect(closeButton).toBeTruthy();
			});

			it('should have correct label for close button', async () => {
				const closeButton = await tourMenuHarness.getPopoverCloseButton();
				expect(await closeButton.getText()).toContain('i18n.common.close');
			});

			it('should close popover when Escape key pressed', fakeAsync(async () => {
				tourMenuHarness = await loader.getHarness(ObtTourMenuHarness);
				await tourMenuHarness.openPopover();
				fixture.detectChanges();
				const escapeEvent = new KeyboardEvent('keyup', {key: 'Escape'});
				document.dispatchEvent(escapeEvent);
				tick(3000);
				fixture.detectChanges();

				expect(tourMenuHarness.isPopoverOpen()).toBe(false);
			}));

			it('should list 2 new tours', async () => {
				const counts = await tourMenuHarness.getPopoverSectionCounts();
				expect(counts.new).toBe(2);
			});

			it('should list 2 inProgress tours', async () => {
				const counts = await tourMenuHarness.getPopoverSectionCounts();
				expect(counts.inProgress).toBe(2);
			});

			it('should list 2 done tours', async () => {
				const counts = await tourMenuHarness.getPopoverSectionCounts();
				expect(counts.done).toBe(2);
			});

			describe('ActionButtons', () => {
				it('should open tour', fakeAsync(async () => {
					tourMenuHarness = await loader.getHarness(ObtTourMenuHarness);
					if (tourMenuHarness.isPopoverOpen()) {
						tick(3000);
						await tourMenuHarness.openPopover();
						fixture.detectChanges();
					}
					const escapeEvent = new KeyboardEvent('keyup', {key: 'Escape'});
					document.dispatchEvent(escapeEvent);
					tick(3000);
					fixture.detectChanges();

					expect(tourMenuHarness.isPopoverOpen()).toBe(false);
				}));
			});
		});
	});
});

export function createSteps(
	count = 2,
	options?: {
		baseId?: string;
		selectors?: string[];
		stepTitlePrefix?: string;
		stepDescriptionPrefix?: string;
		triggers?: ObTourTrigger[];
	}
): ObTourStep[] {
	const {
		baseId = 'tour',
		selectors = ['#demo-btn-save', '#demo-btn-cancel', '#demo-input-firstname', '#demo-input-email'],
		stepTitlePrefix = 'Step',
		stepDescriptionPrefix = 'Description',
		triggers = [{type: 'manual'}]
	} = options ?? {};

	// eslint-disable-next-line @typescript-eslint/naming-convention,id-length
	return Array.from({length: count}, (_, index) => ({
		stepTitle: `${stepTitlePrefix} ${index + 1} of ${baseId}`,
		stepDescription: `${stepDescriptionPrefix} ${index + 1} for ${baseId}`,
		target: {
			elementSelector: selectors[index % selectors.length]
		},
		triggers
	}));
}

export function createList(
	config: {
		type?: ObTourState;
		idKey?: string;
		steps?: ObTourStep[];
		stepCount?: number;
		selectors?: string[];
		triggers?: ObTourTrigger[];
	}[],
	defaultState: ObTourState = 'new'
): ObTourConfig[] {
	return config.map((tour, index) => {
		const idKey = tour.idKey ?? `tour-${index + 1}`;
		const steps =
			tour.steps ??
			createSteps(tour.stepCount ?? 2, {
				baseId: idKey,
				selectors: tour.selectors,
				triggers: tour.triggers
			});

		const triggers = tour.triggers ?? [{type: 'manual'} as ObTourTrigger];

		return {
			steps,
			tourTitle: `i18n.ob-tour-${idKey}.title`,
			tourDescription: `i18n.ob-tour-${idKey}.description`,
			state: tour.type ?? defaultState,
			storageKey: idKey,
			triggers
		};
	});
}
