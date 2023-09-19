import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {By} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
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
			imports: [ObMockTranslatePipe, ObMockExternalLinkModule, ObPopoverModule, MatIconModule, MatTooltipModule],
			declarations: [ObServiceNavigationProfileComponent, ObServiceNavigationPopoverSectionComponent],
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

	describe('avatarImageUrl', () => {
		it('should be initialized to an empty string', () => {
			expect(component.avatarImageUrl).toBe('');
		});

		describe.each(['', 'http://avatar-url'])('set to "%s"', url => {
			let button: TestElement;
			beforeEach(async () => {
				component.avatarImageUrl = url;
				button = await harness.getTriggerButton();
			});

			it.each([
				{attribute: 'type', value: 'button'},
				{attribute: 'placement', value: 'bottom'}
			])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
				expect(await button.getAttribute(attribute)).toBe(value);
			});

			it('should have "ob-widget" class', async () => {
				expect(await button.hasClass('ob-widget')).toBe(true);
			});
		});

		describe('set to ""', () => {
			let button: TestElement;
			beforeEach(async () => {
				component.avatarImageUrl = '';
				fixture.detectChanges();
				button = await harness.getTriggerButton();
			});

			it.each([
				{attribute: 'id', value: 'service-navigation-toggle-profile-icon-button'},
				{attribute: 'obButton', value: 'secondary'},
				{attribute: 'mat-icon-button', value: ''}
			])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
				expect(await button.getAttribute(attribute)).toBe(value);
			});

			it('should have "ob-widget" class', async () => {
				expect(await button.hasClass('ob-widget')).toBe(true);
			});

			it(`should not contain an image`, async () => {
				expect(await harness.getImage()).toBeNull();
			});

			describe('icon', () => {
				let iconHarness: MatIconHarness;
				beforeEach(async () => {
					iconHarness = await harness.getIconHarness();
				});

				it('should exist', () => {
					expect(iconHarness).toBeTruthy();
				});

				it('should be "user"', async () => {
					expect(await iconHarness.getName()).toBe('user');
				});
			});

			describe('popover header image', () => {
				it('should not exist', fakeAsync(async () => {
					fixture.detectChanges();
					await harness.openPopover();
					fixture.detectChanges();
					tick();
					const popoverHarness = await harness.getPopoverHarness();
					const sections = await popoverHarness.getSections();
					expect(await sections[0].getHeaderImage()).toBeNull();
				}));
			});
		});

		describe('set to "http://avatar-url"', () => {
			let button: TestElement;
			beforeEach(async () => {
				component.avatarImageUrl = 'http://avatar-url';
				button = await harness.getTriggerButton();
			});

			it.each([
				{attribute: 'id', value: 'service-navigation-toggle-profile-image-button'},
				{attribute: 'obButton', value: null},
				{attribute: 'mat-icon-button', value: null}
			])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
				expect(await button.getAttribute(attribute)).toBe(value);
			});

			it('should have "ob-image-button" class', async () => {
				expect(await button.hasClass('ob-image-button')).toBe(true);
			});

			it(`should not contain an icon`, async () => {
				expect(await harness.getIconHarness()).toBeNull();
			});

			describe('image', () => {
				let image: TestElement;
				beforeEach(async () => {
					image = await harness.getImage();
				});

				it(`should exist`, () => {
					expect(image).toBeTruthy();
				});

				it.each([
					{property: 'alt', value: 'i18n.oblique.service-navigation.profile.alt'},
					{property: 'src', value: 'http://avatar-url'}
				])(`should have "$value" as "$property" property`, async ({property, value}) => {
					expect(await image.getAttribute(property)).toBe(value);
				});

				it('should have "ob-profile-avatar" class', async () => {
					expect(await image.hasClass('ob-profile-avatar')).toBe(true);
				});
			});

			describe('popover header image', () => {
				let image: TestElement;
				beforeEach(fakeAsync(async () => {
					fixture.detectChanges();
					await harness.openPopover();
					fixture.detectChanges();
					tick();
					const popoverHarness = await harness.getPopoverHarness();
					const sections = await popoverHarness.getSections();
					image = await sections[0].getHeaderImage();
				}));

				it('should exist', () => {
					expect(image).toBeTruthy();
				});

				it('should have "ob-avatar" as class', async () => {
					expect(await image.hasClass('ob-avatar')).toBe(true);
				});

				it.each([
					{property: 'src', value: 'http://avatar-url'},
					{property: 'alt', value: 'i18n.oblique.service-navigation.profile.alt'}
				])('should have "$value" as "$property" property', async ({property, value}) => {
					expect(await image.getAttribute(property)).toBe(value);
				});
			});
		});
	});

	describe('links', () => {
		it('should be initialized to an empty array', () => {
			expect(component.links).toEqual([]);
		});

		describe('without additional links', () => {
			it('should have 1 section', fakeAsync(async () => {
				component.links = [];
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				const sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
				expect(sections.length).toBe(1);
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

			it('should have 2 sections', () => {
				expect(sections.length).toBe(2);
			});

			describe('second section', () => {
				let section: ObServiceNavigationPopoverSectionComponent;
				beforeEach(() => {
					section = sections[1].componentInstance;
				});

				it('should have "i18n.oblique.service-navigation.profile.links.header" as header', () => {
					expect(section.header).toBe('i18n.oblique.service-navigation.profile.links.header');
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
