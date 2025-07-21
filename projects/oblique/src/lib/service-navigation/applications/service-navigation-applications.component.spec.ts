import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatIconHarness} from '@angular/material/icon/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObPopoverModule} from '../../popover/popover.module';
import {ObServiceNavigationPopoverSectionComponent} from '../shared/popover-section/service-navigation-popover-section.component';
import {ObServiceNavigationApplicationsHarness} from './service-navigation-applications.harness';
import {ObServiceNavigationApplicationsComponent} from './service-navigation-applications.component';
import {ObDisableLinkDirective} from '../shared/disable-link/disable-link.directive';
import {WINDOW} from '../../utilities';
import {ObIsCurrentUrlPipe} from '../shared/popover-section/is-current-url.pipe';
import {ObServiceNavigationApplicationNameStatusPipe} from './service-navigation-application-name-status.pipe';

// Workaround for tooltip tests https://github.com/telerik/kendo-angular/issues/1505
Object.defineProperty(window, 'getComputedStyle', {
	value: () => ({
		getPropertyValue: () => {
			return '';
		}
	})
});

describe(ObServiceNavigationApplicationsComponent.name, () => {
	let component: ObServiceNavigationApplicationsComponent;
	let fixture: ComponentFixture<ObServiceNavigationApplicationsComponent>;
	let harness: ObServiceNavigationApplicationsHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ObMockTranslatePipe,
				MatButtonModule,
				MatIconModule,
				MatTooltipModule,
				ObPopoverModule,
				ObDisableLinkDirective,
				MatTooltipModule,
				ObIsCurrentUrlPipe
			],
			declarations: [
				ObServiceNavigationApplicationsComponent,
				ObServiceNavigationPopoverSectionComponent,
				ObServiceNavigationApplicationNameStatusPipe
			],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: window}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ObServiceNavigationApplicationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationApplicationsHarness);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-service-navigation-applications" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation-applications')).toBe(true);
	});

	describe('lastUsedApplications', () => {
		it('should be initialized to an empty array', () => {
			expect(component.lastUsedApplications).toEqual([]);
		});

		describe('with some applications and while loggedIn', () => {
			beforeEach(fakeAsync(async () => {
				component.isLoggedIn = true;
				component.lastUsedApplications = [
					{name: 'applicationName1', url: 'http://app-url1', image: 'applicationImage1', status: 'online'},
					{name: 'applicationName2', url: 'http://app-url2', image: 'applicationImage2', status: 'offline'}
				];
				await harness.openPopover();
				fixture.detectChanges();
				tick();
			}));

			describe('ob-service-navigation-applications-popover-content', () => {
				it.each(['cdkTrapFocus', 'cdkTrapFocusAutoCapture'])('should have attribute `%s`', async attribute => {
					const popover = await harness.getPopover();
					const hasAttribute = await popover.getAttribute(attribute);
					expect(hasAttribute).not.toBeNull();
				});
			});

			describe('sections', () => {
				let sections: DebugElement[];
				beforeEach(() => {
					sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
				});

				it('should be 1', () => {
					expect(sections.length).toBe(1);
				});

				it('should not find all favorite services link', () => {
					const allFavoriteLink = document.querySelector(ObServiceNavigationApplicationsHarness.allFavoriteLinkSelector);
					expect(allFavoriteLink).toBeNull();
				});

				describe('first section', () => {
					let section: ObServiceNavigationPopoverSectionComponent;
					let content: DebugElement;
					let links: DebugElement[];
					beforeEach(() => {
						section = sections[0].componentInstance;
						content = fixture.debugElement.query(By.css('[obContent]'));
						links = content.queryAll(By.css('a'));
					});

					it('should have "i18n.oblique.service-navigation.applications.last-used.header" as header', () => {
						expect(section.header).toBe('i18n.oblique.service-navigation.applications.last-used.header');
					});

					describe('content', () => {
						it('should exist', () => {
							expect(content).toBeTruthy();
						});

						it('should have "ob-applications" class', () => {
							expect(content.classes['ob-applications']).toBe(true);
						});

						it('should have 2 list item', () => {
							expect(content.queryAll(By.css('li')).length).toBe(2);
						});

						it('should have 2 children', () => {
							expect(links.length).toBe(2);
						});

						describe('first child', () => {
							let link: DebugElement;
							beforeEach(() => {
								link = links[0];
							});

							it('should have "matTooltip" property set to "applicationName1"', async () => {
								const tooltipHarness = (await harness.getAllTooltipHarness(fixture))[1];
								await tooltipHarness.show();
								expect(await tooltipHarness.getTooltipText()).toBe('applicationName1');
							});

							it('should be an anchor', () => {
								expect(link.name).toBe('a');
							});

							it('should have "ob-application" class', () => {
								expect(link.classes['ob-application']).toBe(true);
							});

							it('should have "href" attribute set to "http://app-url1"', () => {
								expect(link.attributes.href).toBe('http://app-url1');
							});

							it('should not have "ob-offline" class', () => {
								expect(link.classes['ob-offline']).toBe(undefined);
							});

							it('should have "isExternalLink" property set to "false"', () => {
								expect(link.properties.isExternalLink).toBe(false);
							});

							it('should have 2 children', () => {
								expect(link.children.length).toBe(2);
							});

							describe('first child', () => {
								let image: DebugElement;
								beforeEach(() => {
									image = link.children[0];
								});

								it('should be a "img"', () => {
									expect(image.name).toBe('img');
								});

								it('should have "ob-application-image" class', () => {
									expect(image.classes['ob-application-image']).toBe(true);
								});

								it('should not have "ob-offline" class', () => {
									expect(image.classes['ob-offline']).toBeUndefined();
								});

								it('should have an empty "alt" attribute', () => {
									expect(image.attributes.alt).toBe('');
								});

								it('should have "applicationImage" as "src" attribute', () => {
									expect(image.attributes.src).toBe('applicationImage1');
								});
							});

							describe('second child', () => {
								let span: DebugElement;
								beforeEach(() => {
									span = link.children[1];
								});

								it('should be a "span"', () => {
									expect(span.name).toBe('span');
								});

								it('should have "ob-application" class', () => {
									expect(span.classes['ob-application-title']).toBe(true);
								});

								it('should have "applicationName1" as content', () => {
									expect(span.nativeElement.textContent).toBe('applicationName1');
								});
							});
						});

						describe('second child', () => {
							let link: DebugElement;
							beforeEach(() => {
								link = links[1];
							});

							it('should have "matTooltip" property set to "applicationName2 - i18n.oblique.service-navigation.applications.status.offline"', async () => {
								const tooltipHarness = (await harness.getAllTooltipHarness(fixture))[2];
								await tooltipHarness.show();
								expect(await tooltipHarness.getTooltipText()).toBe(
									'applicationName2 - i18n.oblique.service-navigation.applications.status.offline'
								);
							});

							it('should be an anchor', () => {
								expect(link.name).toBe('a');
							});

							it('should have "ob-application" class', () => {
								expect(link.classes['ob-application']).toBe(true);
							});

							it('should NOT have "href" attribute', () => {
								expect(link.attributes.href).toBe(undefined);
							});

							it('should have aria-disabled', () => {
								expect(link.attributes['aria-disabled']).toBe('true');
							});

							it('should have "ob-offline" class', () => {
								expect(link.classes['ob-offline']).toBe(true);
							});

							it('should have "isExternalLink" property set to "false"', () => {
								expect(link.properties.isExternalLink).toBe(false);
							});

							it('should have 2 children', () => {
								expect(link.children.length).toBe(2);
							});

							describe('first child', () => {
								let image: DebugElement;
								beforeEach(() => {
									image = link.children[0];
								});

								it('should be a "img"', () => {
									expect(image.name).toBe('img');
								});

								it('should have "ob-application-image" class', () => {
									expect(image.classes['ob-application-image']).toBe(true);
								});

								it('should have an empty "alt" attribute', () => {
									expect(image.attributes.alt).toBe('');
								});

								it('should have "applicationImage" as "src" attribute', () => {
									expect(image.attributes.src.startsWith('applicationImage2')).toBe(true);
								});
							});

							describe('second child', () => {
								let span: DebugElement;
								beforeEach(() => {
									span = link.children[1];
								});

								it('should be a "span"', () => {
									expect(span.name).toBe('span');
								});

								it('should have "ob-application" class', () => {
									expect(span.classes['ob-application-title']).toBe(true);
								});

								it('should have "applicationName2 - i18n.oblique.service-navigation.applications.status.offline" as content', () => {
									expect(span.nativeElement.textContent).toBe(
										'applicationName2 - i18n.oblique.service-navigation.applications.status.offline'
									);
								});
							});
						});
					});
				});
			});
		});
	});

	describe('favoriteApplications', () => {
		it('should be initialized to an empty array', () => {
			expect(component.favoriteApplications).toEqual([]);
		});

		describe('with some applications and while loggedIn', () => {
			beforeEach(fakeAsync(async () => {
				component.isLoggedIn = true;
				component.favoriteApplications = [
					{name: 'applicationName1', url: 'http://app-url1', image: 'applicationImage1', status: 'online'},
					{name: 'applicationName2', url: 'http://app-url2', image: 'applicationImage2', status: 'offline'}
				];
				await harness.openPopover();
				fixture.detectChanges();
				tick();
			}));

			xdescribe('Show all favorite anchor', () => {
				let button: TestElement;

				beforeEach(async () => {
					button = await harness.getAllFavoriteServicesLink();
				});

				it('should exists', () => {
					expect(button).toBeTruthy();
				});

				it.each([
					{
						attribute: 'mat-button',
						value: ''
					},
					{
						attribute: 'obButton',
						value: 'secondary'
					}
				])('should have attribute "$attribute" to have value "$value"', async ({attribute, value}) => {
					expect(await button.getAttribute(attribute)).toBe(value);
				});

				it.each([
					{
						property: 'href',
						value: `http://localhost/?favoritesOnly=true`
					},
					{
						property: 'isExternalLink',
						value: false
					}
				])('should have property "$attribute" to have value "$value"', async ({property, value}) => {
					expect(await button.getProperty(property)).toBe(value);
				});

				it('should have text "i18n.oblique.service-navigation.applications.favorite.button"', async () => {
					expect(await button.text()).toBe('i18n.oblique.service-navigation.applications.favorite.button');
				});
			});

			describe('sections', () => {
				let sections: DebugElement[];
				beforeEach(() => {
					sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
				});

				it('should be 1', () => {
					expect(sections.length).toBe(1);
				});

				describe('first section', () => {
					let section: ObServiceNavigationPopoverSectionComponent;
					let content: DebugElement;
					let links: DebugElement[];
					beforeEach(() => {
						section = sections[0].componentInstance;
						content = fixture.debugElement.query(By.css('[obContent]'));
						links = content.queryAll(By.css('a'));
					});

					it('should have "i18n.oblique.service-navigation.applications.favorite.header" as header', () => {
						expect(section.header).toBe('i18n.oblique.service-navigation.applications.favorite.header');
					});

					describe('content', () => {
						it('should exist', () => {
							expect(content).toBeTruthy();
						});

						it('should have "ob-applications" class', () => {
							expect(content.classes['ob-applications']).toBe(true);
						});

						it('should have 2 list item', () => {
							expect(content.queryAll(By.css('li')).length).toBe(2);
						});

						it('should have 2 children', () => {
							expect(links.length).toBe(2);
						});

						describe('first child', () => {
							let link: DebugElement;
							beforeEach(() => {
								link = links[0];
							});

							it('should have "matTooltip" property set to "applicationName1"', async () => {
								const tooltipHarness = (await harness.getAllTooltipHarness(fixture))[1];
								await tooltipHarness.show();
								expect(await tooltipHarness.getTooltipText()).toBe('applicationName1');
							});

							it('should be an anchor', () => {
								expect(link.name).toBe('a');
							});

							it('should have "ob-application" class', () => {
								expect(link.classes['ob-application']).toBe(true);
							});

							it('should have "href" attribute set to "http://app-url1"', () => {
								expect(link.attributes.href).toBe('http://app-url1');
							});

							it('should not have "ob-offline" class', () => {
								expect(link.classes['ob-offline']).toBe(undefined);
							});

							it('should have "isExternalLink" property set to "false"', () => {
								expect(link.properties.isExternalLink).toBe(false);
							});

							it('should have 2 children', () => {
								expect(link.children.length).toBe(2);
							});

							describe('first child', () => {
								let image: DebugElement;
								beforeEach(() => {
									image = link.children[0];
								});

								it('should be a "img"', () => {
									expect(image.name).toBe('img');
								});

								it('should have "ob-application-image" class', () => {
									expect(image.classes['ob-application-image']).toBe(true);
								});

								it('should not have "ob-offline" class', () => {
									expect(image.classes['ob-offline']).toBeUndefined();
								});

								it('should have an empty "alt" attribute', () => {
									expect(image.attributes.alt).toBe('');
								});

								it('should have "applicationImage" as "src" attribute', () => {
									expect(image.attributes.src).toBe('applicationImage1');
								});
							});

							describe('second child', () => {
								let span: DebugElement;
								beforeEach(() => {
									span = link.children[1];
								});

								it('should be a "span"', () => {
									expect(span.name).toBe('span');
								});

								it('should have "ob-application" class', () => {
									expect(span.classes['ob-application-title']).toBe(true);
								});

								it('should have "applicationName1" as content', () => {
									expect(span.nativeElement.textContent).toBe('applicationName1');
								});
							});
						});

						describe('second child', () => {
							let link: DebugElement;
							beforeEach(() => {
								link = links[1];
							});

							it('should have "matTooltip" property set to "applicationName2 - i18n.oblique.service-navigation.applications.status.offline"', async () => {
								const tooltipHarness = (await harness.getAllTooltipHarness(fixture))[2];
								await tooltipHarness.show();
								expect(await tooltipHarness.getTooltipText()).toBe(
									'applicationName2 - i18n.oblique.service-navigation.applications.status.offline'
								);
							});

							it('should be an anchor', () => {
								expect(link.name).toBe('a');
							});

							it('should have "ob-application" class', () => {
								expect(link.classes['ob-application']).toBe(true);
							});

							it('should NOT have "href" attribute', () => {
								expect(link.attributes.href).toBe(undefined);
							});

							it('should have aria-disabled', () => {
								expect(link.attributes['aria-disabled']).toBe('true');
							});

							it('should have "ob-offline" class', () => {
								expect(link.classes['ob-offline']).toBe(true);
							});

							it('should have "isExternalLink" property set to "false"', () => {
								expect(link.properties.isExternalLink).toBe(false);
							});

							it('should have 2 children', () => {
								expect(link.children.length).toBe(2);
							});

							describe('first child', () => {
								let image: DebugElement;
								beforeEach(() => {
									image = link.children[0];
								});

								it('should be a "img"', () => {
									expect(image.name).toBe('img');
								});

								it('should have "ob-application-image" class', () => {
									expect(image.classes['ob-application-image']).toBe(true);
								});

								it('should have "" as "alt" attribute', () => {
									expect(image.attributes.alt).toBe('');
								});
							});

							describe('second child', () => {
								let span: DebugElement;
								beforeEach(() => {
									span = link.children[1];
								});

								it('should be a "span"', () => {
									expect(span.name).toBe('span');
								});

								it('should have "ob-application" class', () => {
									expect(span.classes['ob-application-title']).toBe(true);
								});

								it('should have "applicationName2 - i18n.oblique.service-navigation.applications.status.offline" as content', () => {
									expect(span.nativeElement.textContent).toBe(
										'applicationName2 - i18n.oblique.service-navigation.applications.status.offline'
									);
								});
							});
						});
					});
				});
			});
		});
	});

	describe('applicationsUrl', () => {
		it('should be initialized to an empty string', () => {
			expect(component.applicationsUrl).toBe('');
		});

		it('should be mapped to the link "href" property', async () => {
			component.applicationsUrl = 'applications-url';
			const trigger = await harness.getTrigger();
			expect(await trigger.getAttribute('href')).toBe('applications-url');
		});
	});

	describe('isLoggedIn', () => {
		it('should be initialized to "false"', () => {
			expect(component.isLoggedIn).toBe(false);
		});

		describe.each([false, true])('set to "%s"', isLoggedIn => {
			let trigger: TestElement;
			beforeEach(async () => {
				component.isLoggedIn = isLoggedIn;
				fixture.detectChanges();
				trigger = await harness.getTrigger();
			});

			it.each([
				{attribute: 'obButton', val: 'tertiary'},
				{attribute: 'mat-icon-button', val: ''}
			])('should have "$val" as "$attribute" attribute', async ({attribute, val}) => {
				expect(await trigger.getAttribute(attribute)).toBe(val);
			});

			it('should have "ob-widget" class', async () => {
				expect(await trigger.hasClass('ob-widget')).toBe(true);
			});

			describe('tooltip', () => {
				it('should exist', async () => {
					expect(await harness.getTooltipHarness(fixture)).toBeTruthy();
				});
			});

			describe('icon', () => {
				let icon: MatIconHarness;

				beforeEach(async () => {
					icon = await harness.getIconHarness(fixture);
				});

				it('should be contained', () => {
					expect(icon).toBeTruthy();
				});

				it('should show "apps" icon', async () => {
					expect(await icon.getName()).toBe('apps');
				});
			});
		});

		describe('set to "false"', () => {
			let trigger: TestElement;
			beforeEach(async () => {
				component.isLoggedIn = false;
				fixture.detectChanges();
				trigger = await harness.getTrigger();
			});

			it('should be a link', async () => {
				expect(await trigger.matchesSelector('a')).toBe(true);
			});

			it('should have "i18n.oblique.service-navigation.applications.link.label" as text', async () => {
				expect(await harness.getTriggerScreenReaderText()).toBe('i18n.oblique.service-navigation.applications.link.label');
			});

			it.each([
				{attribute: 'id', val: 'service-navigation-applications-link'},
				{attribute: 'href', val: ''}
			])('should have $val as $attribute', async ({attribute, val}) => {
				expect(await trigger.getAttribute(attribute)).toBe(val);
			});

			it('should have "false" as "isExternalLink" property', async () => {
				expect(await trigger.getProperty('isExternalLink')).toBe(false);
			});

			describe('tooltip', () => {
				it(`should have "i18n.oblique.service-navigation.applications.link.label" as text`, async () => {
					const tooltipHarness = await harness.getTooltipHarness(fixture);
					await tooltipHarness.show();
					expect(await tooltipHarness.getTooltipText()).toBe(`i18n.oblique.service-navigation.applications.link.label`);
				});
			});
		});

		describe('set to "true"', () => {
			let trigger: TestElement;
			beforeEach(async () => {
				component.isLoggedIn = true;
				fixture.detectChanges();
				trigger = await harness.getTrigger();
			});

			it('should be a button', async () => {
				expect(await trigger.matchesSelector('button')).toBe(true);
			});

			it('should have "i18n.oblique.service-navigation.applications.button.label" as text', async () => {
				expect(await harness.getTriggerScreenReaderText()).toBe('i18n.oblique.service-navigation.applications.button.label');
			});

			it.each([
				{attribute: 'id', val: 'service-navigation-applications-button'},
				{attribute: 'type', val: 'button'},
				{attribute: 'placement', val: 'bottom'}
			])('should have $val as $attribute', async ({attribute, val}) => {
				expect(await trigger.getAttribute(attribute)).toBe(val);
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

				xdescribe('Show all services anchor', () => {
					let button: TestElement;

					beforeEach(async () => {
						button = await harness.getAllServicesLink();
					});

					it('should exists', () => {
						expect(button).toBeTruthy();
					});

					it.each([
						{
							attribute: 'mat-button',
							value: ''
						},
						{
							attribute: 'obButton',
							value: 'secondary'
						}
					])('should have attribute "$attribute" to have value "$value"', async ({attribute, value}) => {
						expect(await button.getAttribute(attribute)).toBe(value);
					});

					it.each([
						{
							property: 'href',
							value: `http://localhost/`
						},
						{
							property: 'isExternalLink',
							value: false
						}
					])('should have property "$attribute" to have value "$value"', async ({property, value}) => {
						expect(await button.getProperty(property)).toBe(value);
					});

					it('should have text "i18n.oblique.service-navigation.applications.favorite.button"', async () => {
						expect(await button.text()).toBe('i18n.oblique.service-navigation.applications.link.label');
					});
				});
			});
		});
	});
});
