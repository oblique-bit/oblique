import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ObMockExternalLinkModule} from '../../external-link/_mocks/mock-external-link.module';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObPopoverModule} from '../../popover/popover.module';
import {ObServiceNavigationPopoverSectionComponent} from '../shared/popover-section/service-navigation-popover-section.component';
import {ObServiceNavigationProfileHarness} from './service-navigation-profile.harness';
import {ObServiceNavigationProfileComponent} from './service-navigation-profile.component';

describe('ObServiceNavigationProfileComponent', () => {
	let component: ObServiceNavigationProfileComponent;
	let fixture: ComponentFixture<ObServiceNavigationProfileComponent>;
	let harness: ObServiceNavigationProfileHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObMockExternalLinkModule, ObPopoverModule, MatIconTestingModule, MatTooltipModule],
			declarations: [ObServiceNavigationProfileComponent, ObMockTranslatePipe, ObServiceNavigationPopoverSectionComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(ObServiceNavigationProfileComponent);
		component = fixture.componentInstance;
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationProfileHarness);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-service-navigation-profile" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation-profile')).toBe(true);
	});

	describe('userName', () => {
		it('should be initialized to an empty string', () => {
			expect(component.userName).toBe('');
		});

		describe.each([
			{name: '', header: 'i18n.oblique.service-navigation.profile.guest'},
			{name: 'John Doe', header: 'John Doe'}
		])('set to "$name"', ({name, header}) => {
			it(`should show "${header}" as header`, fakeAsync(async () => {
				component.userName = name;
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				const section = fixture.debugElement.query(By.directive(ObServiceNavigationPopoverSectionComponent)).componentInstance;
				expect(section.header).toBe(header);
			}));
		});
	});

	describe('settingsUrl', () => {
		it('should be initialized to an empty string', () => {
			expect(component.settingsUrl).toBe('');
		});

		describe.each(['', 'Http://settings-url'])('set to "%s"', url => {
			it(`should show "${url}" as link`, fakeAsync(async () => {
				component.settingsUrl = url;
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				const section = fixture.debugElement.query(By.directive(ObServiceNavigationPopoverSectionComponent)).componentInstance;
				expect(section.links[0].url).toBe(url);
			}));
		});
	});

	describe('button', () => {
		let button: TestElement;
		beforeEach(async () => {
			button = await harness.getTriggerButton();
		});

		it('should exist', () => {
			expect(button).toBeTruthy();
		});

		it.each([
			{attribute: 'type', value: 'button'},
			{attribute: 'placement', value: 'bottom'},
			{attribute: 'id', value: 'service-navigation-toggle-profile-icon-button'},
			{attribute: 'obButton', value: 'secondary'},
			{attribute: 'mat-icon-button', value: ''}
		])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
			expect(await button.getAttribute(attribute)).toBe(value);
		});

		it.each(['ob-widget', 'ob-user'])('should have "%s" class', async className => {
			expect(await button.hasClass(className)).toBe(true);
		});

		it('should have "i18n.oblique.service-navigation.profile.button" as screen reader text', async () => {
			expect(await harness.getTriggerButtonScreenReaderText()).toBe('i18n.oblique.service-navigation.profile.button');
		});

		describe('tooltip', () => {
			let tooltipHarness: MatTooltipHarness;

			beforeEach(async () => {
				tooltipHarness = await harness.getTooltipHarness();
			});

			it('should exist', () => {
				expect(tooltipHarness).toBeTruthy();
			});

			it('should have "i18n.oblique.service-navigation.profile.tooltip" as text', async () => {
				await tooltipHarness.show();
				const text = await tooltipHarness.getTooltipText();
				expect(text).toBe('i18n.oblique.service-navigation.profile.tooltip');
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

			describe('sections', () => {
				let sections: DebugElement[];
				beforeEach(() => {
					sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
				});

				it('should have 1', () => {
					expect(sections.length).toBe(1);
				});

				describe('first section', () => {
					let section: ObServiceNavigationPopoverSectionComponent;
					beforeEach(() => {
						section = sections[0].componentInstance;
					});

					describe('header', () => {
						it('should have "i18n.oblique.service-navigation.profile.guest" as text', () => {
							expect(section.header).toBe('i18n.oblique.service-navigation.profile.guest');
						});
					});

					describe('links', () => {
						it('should have 1', () => {
							expect(section.links.length).toBe(1);
						});

						it.each([
							{property: 'icon', value: 'cog'},
							{property: 'isInternalLink', value: true},
							{property: 'label', value: 'i18n.oblique.service-navigation.profile.settings'},
							{property: 'url', value: ''}
						])('should have "$value" as "$property" property', ({property, value}) => {
							expect(section.links[0][property]).toBe(value);
						});
					});
				});
			});
		});
	});
});
