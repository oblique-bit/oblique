import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatIconHarness} from '@angular/material/icon/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObPopoverModule} from '../../popover/popover.module';
import {ObSafeImagePipe} from '../shared/safe-image.pipe';
import {ObServiceNavigationPopoverSectionComponent} from '../shared/popover-section/service-navigation-popover-section.component';
import {ObLimitArraySizePipe} from '../shared/limit-array-size.pipe';
import {ObServiceNavigationApplicationAltPipe} from './service-navigation-application-image-alt.pipe';
import {ObServiceNavigationApplicationsHarness} from './service-navigation-applications.harness';
import {ObServiceNavigationApplicationsComponent} from './service-navigation-applications.component';
import {ObDisableLinkDirective} from '../shared/disable-link/disable-link.directive';

describe('ObServiceNavigationApplicationsComponent', () => {
	let component: ObServiceNavigationApplicationsComponent;
	let fixture: ComponentFixture<ObServiceNavigationApplicationsComponent>;
	let harness: ObServiceNavigationApplicationsHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatButtonModule, MatIconModule, MatTooltipModule, ObPopoverModule, ObDisableLinkDirective],
			declarations: [
				ObLimitArraySizePipe,
				ObServiceNavigationApplicationsComponent,
				ObMockTranslatePipe,
				ObServiceNavigationPopoverSectionComponent,
				ObSafeImagePipe,
				ObServiceNavigationApplicationAltPipe
			],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
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

	describe('maxLastUsedApplications', () => {
		it('should be initialized to "3"', () => {
			expect(component.maxLastUsedApplications).toBe(3);
		});

		it('should throw an error when negative', () => {
			const change = {maxLastUsedApplications: {currentValue: -1, previousValue: 3, firstChange: true, isFirstChange: () => true}};
			expect(() => component.ngOnChanges(change)).toThrowError('maxLastUsedApplications cannot be negative.');
		});
	});

	describe('maxFavoriteApplications', () => {
		it('should be initialized to "3"', () => {
			expect(component.maxFavoriteApplications).toBe(3);
		});

		it('should throw an error when negative', () => {
			const change = {maxFavoriteApplications: {currentValue: -1, previousValue: 3, firstChange: true, isFirstChange: () => true}};
			expect(() => component.ngOnChanges(change)).toThrowError('maxFavoriteApplications cannot be negative.');
		});
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

			describe('sections', () => {
				let sections: DebugElement[];
				beforeEach(() => {
					sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
				});

				it('should be 2', () => {
					expect(sections.length).toBe(2);
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

							it('should be an anchor', () => {
								expect(link.name).toBe('a');
							});

							it('should have "ob-application" class', () => {
								expect(link.classes['ob-application']).toBe(true);
							});

							it('should have "href" attribute set to "http://app-url1"', () => {
								expect(link.attributes.href).toBe('http://app-url1');
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

								it('should have "i18n.oblique.service-navigation.applications.image.online.alt" as "alt" attribute', () => {
									expect(image.attributes.alt).toBe('i18n.oblique.service-navigation.applications.image.online.alt');
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

							it('should have "isExternalLink" property set to "false"', () => {
								expect(link.properties.isExternalLink).toBe(false);
							});

							it('should have 3 children', () => {
								expect(link.children.length).toBe(3);
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

								it('should have "ob-status-image" class', () => {
									expect(image.classes['ob-status-image']).toBe(true);
								});

								it('should have "" as "alt" attribute', () => {
									expect(image.attributes.alt).toBe('');
								});

								it('should have "applicationImage" as "src" attribute', () => {
									expect(image.attributes.src.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA')).toBe(true);
								});

								it('should have "true" as "aria-hidden" attribute', () => {
									expect(image.attributes['aria-hidden']).toBe('true');
								});
							});

							describe('second child', () => {
								let image: DebugElement;
								beforeEach(() => {
									image = link.children[1];
								});

								it('should be a "img"', () => {
									expect(image.name).toBe('img');
								});

								it('should have "ob-application-image" class', () => {
									expect(image.classes['ob-application-image']).toBe(true);
								});

								it('should have "ob-offline" class', () => {
									expect(image.classes['ob-offline']).toBe(true);
								});

								it('should have "i18n.oblique.service-navigation.applications.image.offline.alt" as "alt" attribute', () => {
									expect(image.attributes.alt).toBe('i18n.oblique.service-navigation.applications.image.offline.alt');
								});

								it('should have "applicationImage" as "src" attribute', () => {
									expect(image.attributes.src.startsWith('applicationImage2')).toBe(true);
								});
							});

							describe('third child', () => {
								let span: DebugElement;
								beforeEach(() => {
									span = link.children[2];
								});

								it('should be a "span"', () => {
									expect(span.name).toBe('span');
								});

								it('should have "ob-application" class', () => {
									expect(span.classes['ob-application-title']).toBe(true);
								});

								it('should have "applicationName2" as content', () => {
									expect(span.nativeElement.textContent).toBe('applicationName2');
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

			describe('sections', () => {
				let sections: DebugElement[];
				beforeEach(() => {
					sections = fixture.debugElement.queryAll(By.directive(ObServiceNavigationPopoverSectionComponent));
				});

				it('should be 2', () => {
					expect(sections.length).toBe(2);
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

							it('should be an anchor', () => {
								expect(link.name).toBe('a');
							});

							it('should have "ob-application" class', () => {
								expect(link.classes['ob-application']).toBe(true);
							});

							it('should have "href" attribute set to "http://app-url1"', () => {
								expect(link.attributes.href).toBe('http://app-url1');
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

								it('should have "i18n.oblique.service-navigation.applications.image.online.alt" as "alt" attribute', () => {
									expect(image.attributes.alt).toBe('i18n.oblique.service-navigation.applications.image.online.alt');
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

							it('should have "isExternalLink" property set to "false"', () => {
								expect(link.properties.isExternalLink).toBe(false);
							});

							it('should have 3 children', () => {
								expect(link.children.length).toBe(3);
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

								it('should have "ob-status-image" class', () => {
									expect(image.classes['ob-status-image']).toBe(true);
								});

								it('should have "" as "alt" attribute', () => {
									expect(image.attributes.alt).toBe('');
								});

								it('should have "applicationImage" as "src" attribute', () => {
									expect(image.attributes.src.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA')).toBe(true);
								});

								it('should have "true" as "aria-hidden" attribute', () => {
									expect(image.attributes['aria-hidden']).toBe('true');
								});
							});

							describe('second child', () => {
								let image: DebugElement;
								beforeEach(() => {
									image = link.children[1];
								});

								it('should be a "img"', () => {
									expect(image.name).toBe('img');
								});

								it('should have "ob-application-image" class', () => {
									expect(image.classes['ob-application-image']).toBe(true);
								});

								it('should have "ob-offline" class', () => {
									expect(image.classes['ob-offline']).toBe(true);
								});

								it('should have "i18n.oblique.service-navigation.applications.image.offline.alt" as "alt" attribute', () => {
									expect(image.attributes.alt).toBe('i18n.oblique.service-navigation.applications.image.offline.alt');
								});

								it('should have "applicationImage" as "src" attribute', () => {
									expect(image.attributes.src.startsWith('applicationImage2')).toBe(true);
								});
							});

							describe('third child', () => {
								let span: DebugElement;
								beforeEach(() => {
									span = link.children[2];
								});

								it('should be a "span"', () => {
									expect(span.name).toBe('span');
								});

								it('should have "ob-application" class', () => {
									expect(span.classes['ob-application-title']).toBe(true);
								});

								it('should have "applicationName2" as content', () => {
									expect(span.nativeElement.textContent).toBe('applicationName2');
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
				{attribute: 'obButton', val: 'secondary'},
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
				it(`should have "i18n.oblique.service-navigation.applications.link.tooltip" as text`, async () => {
					const tooltipHarness = await harness.getTooltipHarness(fixture);
					await tooltipHarness.show();
					expect(await tooltipHarness.getTooltipText()).toBe(`i18n.oblique.service-navigation.applications.link.tooltip`);
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
						beforeEach(() => {
							section = sections[0].componentInstance;
						});

						it('should have "i18n.oblique.service-navigation.applications.links.header" as header', () => {
							expect(section.header).toBe('i18n.oblique.service-navigation.applications.links.header');
						});

						describe('links', () => {
							it('should have 1', () => {
								expect(section.links.length).toBe(1);
							});

							it.each([
								{property: 'url', value: ''},
								{property: 'label', value: 'i18n.oblique.service-navigation.applications.link.label'},
								{property: 'isInternalLink', value: true}
							])('should have "$value" as "$property" property on the first link', ({property, value}) => {
								expect(section.links[0][property]).toBe(value);
							});
						});
					});
				});
			});
		});
	});
});
