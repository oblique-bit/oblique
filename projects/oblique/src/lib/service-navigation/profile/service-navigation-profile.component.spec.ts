import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {By} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {DebugElement} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ObMockExternalLinkModule} from '../../external-link/_mocks/mock-external-link.module';
import {ObPopoverModule} from '../../popover/popover.module';
import {ObServiceNavigationPopoverSectionComponent} from '../shared/popover-section/service-navigation-popover-section.component';
import {ObServiceNavigationProfileHarness} from './service-navigation-profile.harness';
import {ObServiceNavigationProfileComponent} from './service-navigation-profile.component';
import {provideObliqueTestingConfiguration} from '../../utilities';
import {ObIsCurrentUrlPipe} from '../shared/popover-section/is-current-url.pipe';

describe('ObServiceNavigationProfileComponent', () => {
	let component: ObServiceNavigationProfileComponent;
	let fixture: ComponentFixture<ObServiceNavigationProfileComponent>;
	let harness: ObServiceNavigationProfileHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ObMockExternalLinkModule,
				ObPopoverModule,
				MatIconModule,
				MatTooltipModule,
				NgOptimizedImage,
				ObIsCurrentUrlPipe,
				TranslateModule,
			],
			declarations: [ObServiceNavigationProfileComponent, ObServiceNavigationPopoverSectionComponent],
			providers: [provideObliqueTestingConfiguration()],
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
			{name: 'John Doe', header: 'John Doe'},
		])('set to "$name"', ({name, header}) => {
			it(`should show "${header}" as header`, fakeAsync(async () => {
				component.userName = name;
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				const section = fixture.debugElement.query(
					By.directive(ObServiceNavigationPopoverSectionComponent)
				).componentInstance;
				expect(section.header).toBe(header);
			}));
		});
	});

	describe('profileUrls', () => {
		it('should be initialized to an empty array', () => {
			expect(component.profileUrls.length).toBe(0);
		});

		describe.each([
			{url: '', label: ''},
			{url: 'Http://settings-url', label: 'settings url', isInternalLink: true},
		])('set to "%s"', url => {
			it(`should show "${url.url}" as link`, fakeAsync(async () => {
				component.profileUrls = [url];
				await harness.openPopover();
				fixture.detectChanges();
				tick();
				const section = fixture.debugElement.query(
					By.directive(ObServiceNavigationPopoverSectionComponent)
				).componentInstance;
				expect(section.links[0].url).toBe(url.url);
			}));
		});
	});

	describe('avatar icon', () => {
		let button: TestElement;
		beforeEach(async () => {
			fixture.detectChanges();
			button = await harness.getTriggerButton();
		});

		it.each([
			{attribute: 'id', value: 'service-navigation-toggle-profile-icon-button'},
			{attribute: 'obButton', value: 'secondary'},
			{attribute: 'mat-icon-button', value: ''},
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

			it('should be "person"', async () => {
				expect(await iconHarness.getName()).toBe('person');
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
					{url: 'url_2', label: 'URL 2'},
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
						{property: 'label', value: 'URL 1'},
					])('should have "$value" as "$property" property on the first link', ({property, value}) => {
						expect(section.links[0][property]).toBe(value);
					});

					it.each([
						{property: 'url', value: 'url_2'},
						{property: 'label', value: 'URL 2'},
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
			{attribute: 'mat-icon-button', value: ''},
		])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
			expect(await button.getAttribute(attribute)).toBe(value);
		});

		it.each(['ob-widget', 'ob-user'])('should have "%s" class', async className => {
			expect(await button.hasClass(className)).toBe(true);
		});

		describe('tooltip', () => {
			let tooltipHarness: MatTooltipHarness;

			beforeEach(async () => {
				tooltipHarness = await harness.getTooltipHarness();
			});

			it('should exist', () => {
				expect(tooltipHarness).toBeTruthy();
			});

			it('should have "i18n.oblique.service-navigation.profile.button" as text', async () => {
				await tooltipHarness.show();
				const text = await tooltipHarness.getTooltipText();
				expect(text).toBe('i18n.oblique.service-navigation.profile.button');
			});
		});

		describe('popover', () => {
			const fakeProfileUrls = [
				{url: 'http://fakeUrl1.url', label: 'url1'},
				{url: 'http://fakeUrl2.url', label: 'url2'},
			];

			beforeEach(fakeAsync(async () => {
				fixture.detectChanges();
				await harness.openPopover();
				component.profileUrls = fakeProfileUrls;
				fixture.detectChanges();
				tick();
			}));

			it(`should exist`, async () => {
				expect(await harness.getPopoverHarness()).toBeTruthy();
			});

			describe('Content div', () => {
				it.each(['cdkTrapFocus', 'cdkTrapFocusAutoCapture'])('should have the %s attribute', async value => {
					const contentDiv = await harness.getContentDiv();
					const trapFocusAttribute = await contentDiv.getAttribute(value);
					expect(trapFocusAttribute).not.toBeNull();
				});
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
						it('should have 2', () => {
							expect(section.links.length).toBe(2);
						});
					});
				});
			});
		});
	});
});
