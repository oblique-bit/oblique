import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {By} from '@angular/platform-browser';
import {ObPopoverModule} from '../../popover/popover.module';
import {ObServiceNavigationPopoverSectionComponent} from '../shared/popover-section/service-navigation-popover-section.component';
import {ObServiceNavigationInfoHarness} from './service-navigation-info.harness';
import {ObServiceNavigationInfoComponent} from './service-navigation-info.component';
import {ObContactToLinksPipe} from './contact-to-links.pipe';
import {provideObliqueTestingConfiguration} from '../../utilities';
import {ObIsCurrentUrlPipe} from '../shared/popover-section/is-current-url.pipe';
import {TranslateModule} from '@ngx-translate/core';

describe(ObServiceNavigationInfoComponent.name, () => {
	let component: ObServiceNavigationInfoComponent;
	let fixture: ComponentFixture<ObServiceNavigationInfoComponent>;
	let harness: ObServiceNavigationInfoHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule, MatTooltipModule, ObPopoverModule, ObIsCurrentUrlPipe, TranslateModule],
			declarations: [ObServiceNavigationInfoComponent, ObServiceNavigationPopoverSectionComponent, ObContactToLinksPipe],
			providers: [provideObliqueTestingConfiguration()]
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

		describe('with contact property only', () => {
			let sections: DebugElement[];
			beforeEach(fakeAsync(async () => {
				component.contact = {formUrl: 'https://example.com/'};
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
					let links: DebugElement[];
					let extraTexts: DebugElement[];

					beforeEach(() => {
						links = fixture.debugElement.queryAll(By.css('a'));
						extraTexts = fixture.debugElement.queryAll(By.css('.ob-extra-text'));
					});

					it('should have 1', () => {
						expect(links.length).toBe(1);
					});

					it('should have "https://example.com/" as "href" property on the first link', () => {
						expect(links[0].attributes['href']).toBe('https://example.com/');
					});

					it('should have "i18n.oblique.service-navigation.info.contact.form" as innerHTML property on the first link', () => {
						expect(links[0].nativeElement.innerHTML).toContain('i18n.oblique.service-navigation.info.contact.form');
					});

					it('should have no extra text section', () => {
						expect(extraTexts.length).toBe(0);
					});
				});
			});
		});

		describe('with phone property only', () => {
			let sections: DebugElement[];
			beforeEach(fakeAsync(async () => {
				component.contact = {phone: '123'};
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
					let links: DebugElement[];
					let extraTexts: DebugElement[];

					beforeEach(() => {
						links = fixture.debugElement.queryAll(By.css('a'));
						extraTexts = fixture.debugElement.queryAll(By.css('.ob-extra-text'));
					});

					it('should have 1', () => {
						expect(links.length).toBe(1);
					});

					it('should have "tel:123" as "href" property on the first link', () => {
						expect(links[0].attributes['href']).toBe('tel:123');
					});

					it('should have "123" as innerHTML property on the first link', () => {
						expect(links[0].nativeElement.innerHTML).toContain('123');
					});

					it('should have no extra text section', () => {
						expect(extraTexts.length).toBe(0);
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
					let links: DebugElement[];
					let extraTexts: DebugElement[];

					beforeEach(() => {
						links = fixture.debugElement.queryAll(By.css('a'));
						extraTexts = fixture.debugElement.queryAll(By.css('.ob-extra-text'));
					});

					it('should have 1', () => {
						expect(links.length).toBe(1);
					});

					it('should have "mailto:text@test.com" as "href" property on the first link', () => {
						expect(links[0].attributes['href']).toBe('mailto:text@test.com');
					});

					it('should have "text@test.com" as innerHTML property on the first link', () => {
						expect(links[0].nativeElement.innerHTML).toContain('text@test.com');
					});

					it('should have no extra text section', () => {
						expect(extraTexts.length).toBe(0);
					});
				});
			});
		});

		describe('with email, phone and contact properties', () => {
			let sections: DebugElement[];
			beforeEach(fakeAsync(async () => {
				component.contact = {
					email: 'text@test.com',
					emailText: 'email text',
					phone: '123',
					phoneText: 'tel text',
					formUrl: 'https://example.com/',
					formUrlText: 'form url text'
				};
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
					let links: DebugElement[];
					let bullets: DebugElement[];
					beforeEach(() => {
						links = fixture.debugElement.queryAll(By.css('a'));
						bullets = fixture.debugElement.queryAll(By.css('li'));
					});

					it('should have 3', () => {
						expect(links.length).toBe(3);
					});

					describe('first link', () => {
						it('should have "tel:123" as "href" property', () => {
							expect(links[0].attributes['href']).toBe('tel:123');
						});

						it('should have "123" as innerHTML property', () => {
							expect(links[0].nativeElement.innerHTML).toContain('123');
						});

						it('should have "tel text" in extra text section', () => {
							expect(bullets[0].nativeElement.innerHTML).toContain('tel text');
						});
					});

					describe('second link', () => {
						it('should have "mailto:text@test.com" as "href" property', () => {
							expect(links[1].attributes['href']).toBe('mailto:text@test.com');
						});

						it('should have "text@test.com" as innerHTML property', () => {
							expect(links[1].nativeElement.innerHTML).toContain('text@test.com');
						});

						it('should have "mail text" in extra text section', () => {
							expect(bullets[1].nativeElement.innerHTML).toContain('mail text');
						});
					});

					describe('third link', () => {
						it('should have "https://example.com/" as "href" property ', () => {
							expect(links[2].attributes['href']).toBe('https://example.com/');
						});

						it('should have "text@test.com" as innerHTML property ', () => {
							expect(links[2].nativeElement.innerHTML).toContain('i18n.oblique.service-navigation.info.contact.form');
						});

						it('should have "form url text" in extra text section', () => {
							expect(bullets[2].nativeElement.innerHTML).toContain('form url text');
						});
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
			{attribute: 'obButton', value: 'tertiary'},
			{attribute: 'mat-icon-button', value: ''},
			{attribute: 'id', value: 'service-navigation-info-popover-toggle'},
			{attribute: 'placement', value: 'bottom'}
		])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
			expect(await element.getAttribute(attribute)).toBe(value);
		});

		it('should have "ob-widget" class', async () => {
			expect(await element.hasClass('ob-widget')).toBe(true);
		});

		describe('Content div', () => {
			it.each(['cdkTrapFocus', 'cdkTrapFocusAutoCapture'])('should have the %s attribute', async value => {
				await harness.openPopover();
				const contentDiv = await harness.getContentDiv();
				const trapFocusAttribute = await contentDiv.getAttribute(value);
				expect(trapFocusAttribute).not.toBeNull();
			});
		});

		describe('tooltip', () => {
			let tooltip: MatTooltipHarness;
			beforeEach(async () => {
				tooltip = await harness.getTooltipHarness();
			});

			it('should be defined', () => {
				expect(tooltip).toBeTruthy();
			});

			it('should have "i18n.oblique.service-navigation.info.button" as text', async () => {
				await tooltip.show();
				const text = await tooltip.getTooltipText();
				expect(text).toBe('i18n.oblique.service-navigation.info.button');
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

			it('should show "question" icon', async () => {
				expect(await icon.getName()).toBe('question');
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
