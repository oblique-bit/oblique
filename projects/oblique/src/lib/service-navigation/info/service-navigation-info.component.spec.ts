import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObPopoverModule} from '../../popover/popover.module';
import {ObServiceNavigationPopoverSectionComponent} from '../shared/popover-section/service-navigation-popover-section.component';
import {ObServiceNavigationInfoHarness} from './service-navigation-info.harness';
import {ObServiceNavigationInfoComponent} from './service-navigation-info.component';
import {ObContactToLinksPipe} from './contact-to-links.pipe';

describe('ObServiceNavigationInfoComponent', () => {
	let component: ObServiceNavigationInfoComponent;
	let fixture: ComponentFixture<ObServiceNavigationInfoComponent>;
	let harness: ObServiceNavigationInfoHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule, MatTooltipModule, ObPopoverModule],
			declarations: [
				ObServiceNavigationInfoComponent,
				ObServiceNavigationPopoverSectionComponent,
				ObMockTranslatePipe,
				ObContactToLinksPipe
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ObServiceNavigationInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationInfoHarness);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-service-navigation-info" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation-info')).toBe(true);
	});

	describe('links', () => {
		it('should be initialized to an empty array', () => {
			expect(component.links).toEqual([]);
		});

		describe('without additional links', () => {
			it('should have 0 section', fakeAsync(async () => {
				component.links = [];
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				const sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
				expect(sections.length).toBe(0);
			}));
		});

		describe('with additional links', () => {
			let sections: DebugElement[];
			beforeEach(fakeAsync(async () => {
				component.links = [
					{url: 'url_1', label: 'URL 1'},
					{url: 'url_2', label: 'URL 2'}
				];
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
			}));

			it('should have 1 section', () => {
				expect(sections.length).toBe(1);
			});

			describe('first section', () => {
				let section: ObServiceNavigationPopoverSectionComponent;
				beforeEach(() => {
					section = sections[0].componentInstance;
				});

				it('should have "i18n.oblique.service-navigation.info.header" as header', () => {
					expect(section.header).toBe('i18n.oblique.service-navigation.info.header');
				});

				describe('links', () => {
					it('should have 2', () => {
						expect(section.links.length).toBe(2);
					});

					it.each([
						{property: 'url', value: 'url_1'},
						{property: 'label', value: 'URL 1'}
					])('should have "$value" as "$property" property on the first link', ({property, value}) => {
						expect(section.links[0][property]).toBe(value);
					});

					it.each([
						{property: 'url', value: 'url_2'},
						{property: 'label', value: 'URL 2'}
					])('should have "$value" as "$property" property on the second link', ({property, value}) => {
						expect(section.links[1][property]).toBe(value);
					});
				});
			});
		});
	});

	describe('contact', () => {
		it('should be initialized to undefined', () => {
			expect(component.contact).toBeUndefined();
		});

		describe('without contact', () => {
			it('should have 0 section', fakeAsync(async () => {
				component.links = [];
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				const sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
				expect(sections.length).toBe(0);
			}));
		});

		describe('with tel property only', () => {
			let sections: DebugElement[];
			beforeEach(fakeAsync(async () => {
				component.contact = {tel: '123'};
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
			}));

			it('should have 1 section', () => {
				expect(sections.length).toBe(1);
			});

			describe('first section', () => {
				let section: ObServiceNavigationPopoverSectionComponent;
				beforeEach(() => {
					section = sections[0].componentInstance;
				});

				it('should have "i18n.oblique.service-navigation.info.contact.header" as header', () => {
					expect(section.header).toBe('i18n.oblique.service-navigation.info.contact.header');
				});

				describe('links', () => {
					it('should have 1', () => {
						expect(section.links.length).toBe(1);
					});

					it.each([
						{property: 'url', value: 'tel:123'},
						{property: 'label', value: '123'}
					])('should have "$value" as "$property" property on the first link', ({property, value}) => {
						expect(section.links[0][property]).toBe(value);
					});
				});
			});
		});

		describe('with email property only', () => {
			let sections: DebugElement[];
			beforeEach(fakeAsync(async () => {
				component.contact = {email: 'text@test.com'};
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
			}));

			it('should have 1 section', () => {
				expect(sections.length).toBe(1);
			});

			describe('first section', () => {
				let section: ObServiceNavigationPopoverSectionComponent;
				beforeEach(() => {
					section = sections[0].componentInstance;
				});

				it('should have "i18n.oblique.service-navigation.info.contact.header" as header', () => {
					expect(section.header).toBe('i18n.oblique.service-navigation.info.contact.header');
				});

				describe('links', () => {
					it('should have 1', () => {
						expect(section.links.length).toBe(1);
					});

					it.each([
						{property: 'url', value: 'mailto:text@test.com'},
						{property: 'label', value: 'text@test.com'}
					])('should have "$value" as "$property" property on the first link', ({property, value}) => {
						expect(section.links[0][property]).toBe(value);
					});
				});
			});
		});

		describe('with email and tel properties', () => {
			let sections: DebugElement[];
			beforeEach(fakeAsync(async () => {
				component.contact = {email: 'text@test.com', tel: '123'};
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
			}));

			it('should have 1 section', () => {
				expect(sections.length).toBe(1);
			});

			describe('first section', () => {
				let section: ObServiceNavigationPopoverSectionComponent;
				beforeEach(() => {
					section = sections[0].componentInstance;
				});

				it('should have "i18n.oblique.service-navigation.info.contact.header" as header', () => {
					expect(section.header).toBe('i18n.oblique.service-navigation.info.contact.header');
				});

				describe('links', () => {
					it('should have 2', () => {
						expect(section.links.length).toBe(2);
					});

					it.each([
						{property: 'url', value: 'mailto:text@test.com'},
						{property: 'label', value: 'text@test.com'}
					])('should have "$value" as "$property" property on the first link', ({property, value}) => {
						expect(section.links[0][property]).toBe(value);
					});

					it.each([
						{property: 'url', value: 'tel:123'},
						{property: 'label', value: '123'}
					])('should have "$value" as "$property" property on the first link', ({property, value}) => {
						expect(section.links[1][property]).toBe(value);
					});
				});
			});
		});
	});

	describe('button', () => {
		let element: TestElement;
		beforeEach(async () => {
			element = await harness.getTriggerButton();
		});

		it('should exists', () => {
			expect(element).toBeTruthy();
		});

		it.each([
			{attribute: 'type', value: 'button'},
			{attribute: 'obButton', value: 'secondary'},
			{attribute: 'mat-icon-button', value: ''},
			{attribute: 'id', value: 'service-navigation-info-popover-toggle'},
			{attribute: 'placement', value: 'bottom'}
		])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
			expect(await element.getAttribute(attribute)).toBe(value);
		});

		it('should have "ob-widget" class', async () => {
			expect(await element.hasClass('ob-widget')).toBe(true);
		});

		it('should have "i18n.oblique.service-navigation.info.button" as screen reader text', async () => {
			expect(await harness.getTriggerButtonScreenReaderText()).toBe('i18n.oblique.service-navigation.info.button');
		});

		describe('tooltip', () => {
			let tooltip: MatTooltipHarness;
			beforeEach(async () => {
				tooltip = await harness.getTooltipHarness();
			});

			it('should be defined', () => {
				expect(tooltip).toBeTruthy();
			});

			it('should have "i18n.oblique.service-navigation.info.tooltip" as text', async () => {
				await tooltip.show();
				const text = await tooltip.getTooltipText();
				expect(text).toBe('i18n.oblique.service-navigation.info.tooltip');
			});
		});

		describe('icon', () => {
			let icon: MatIconHarness;
			beforeEach(async () => {
				icon = await harness.getIconHarness();
			});

			it('should be contained', () => {
				expect(icon).toBeTruthy();
			});

			it('should show "apps" icon', async () => {
				expect(await icon.getName()).toBe('help');
			});
		});

		describe('popover', () => {
			beforeEach(fakeAsync(async () => {
				fixture.detectChanges();
				await harness.openPopover();
				fixture.detectChanges();
				tick();
			}));

			it(`should exist`, async () => {
				expect(await harness.getPopoverHarness()).toBeTruthy();
			});
		});
	});
});
