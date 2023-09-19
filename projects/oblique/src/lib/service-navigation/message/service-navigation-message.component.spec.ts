import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBadgeHarness} from '@angular/material/badge/testing';
import {MatIconModule} from '@angular/material/icon';
import {TranslateService} from '@ngx-translate/core';
import {ObTranslateParamsModule} from '../../translate-params/translate-params.module';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObServiceNavigationMessageHarness} from './service-navigation-message.harness';
import {ObServiceNavigationMessageComponent} from './service-navigation-message.component';
import {SimpleChange} from '@angular/core';

describe('ObServiceNavigationMessageComponent', () => {
	let component: ObServiceNavigationMessageComponent;
	let fixture: ComponentFixture<ObServiceNavigationMessageComponent>;
	let harness: ObServiceNavigationMessageHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObMockTranslatePipe, MatTooltipModule, ObTranslateParamsModule, MatIconModule, MatBadgeModule],
			declarations: [ObServiceNavigationMessageComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();
	});

	beforeEach(async () => {
		fixture = TestBed.createComponent(ObServiceNavigationMessageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationMessageHarness);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-service-navigation-message" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation-message')).toBe(true);
	});

	describe('linkHref', () => {
		it('should be initialized to an empty string', () => {
			expect(component.linkHref).toBe('');
		});

		it('should be the target of the link', async () => {
			component.linkHref = '/foo';
			fixture.detectChanges();
			const link = await harness.getLink();
			expect(await link.getProperty('href')).toBe('http://localhost/foo');
		});
	});

	describe('count', () => {
		it('should be initialized to 0', () => {
			expect(component.count).toBe(0);
		});

		describe.each([0, 1])('with %s message', count => {
			beforeEach(() => {
				component.count = count;
				fixture.detectChanges();
			});

			describe('badge', () => {
				let badge: MatBadgeHarness;

				beforeEach(async () => {
					badge = await harness.getBadgeHarness();
				});

				it('should exist', () => {
					expect(badge).toBeTruthy();
				});

				it('should be medium', async () => {
					expect(await badge.getSize()).toBe('medium');
				});

				it('should be above after', async () => {
					expect(await badge.getPosition()).toBe('above after');
				});

				it(`should show ${count}`, async () => {
					expect(await badge.getText()).toBe(count.toString());
				});
			});
		});

		describe('with 0 message', () => {
			beforeEach(() => {
				component.count = 0;
				fixture.detectChanges();
			});

			describe('badge', () => {
				let badge: MatBadgeHarness;

				beforeEach(async () => {
					badge = await harness.getBadgeHarness();
				});

				it(`should be hidden`, async () => {
					expect(await badge.isHidden()).toBe(true);
				});
			});
		});

		describe('with 1 message', () => {
			beforeEach(() => {
				component.count = 1;
				fixture.detectChanges();
			});

			describe('badge', () => {
				let badge: MatBadgeHarness;

				beforeEach(async () => {
					badge = await harness.getBadgeHarness();
				});

				it(`should be shown`, async () => {
					expect(await badge.isHidden()).toBe(false);
				});
			});
		});

		describe('with 100 message', () => {
			beforeEach(() => {
				component.count = 100;
				fixture.detectChanges();
			});

			describe('badge', () => {
				const expectMaximumCountString = '99+';
				let badge: MatBadgeHarness;

				beforeEach(async () => {
					badge = await harness.getBadgeHarness();
				});

				describe('ngOnchange count 100', () => {
					beforeEach(() => {
						component.ngOnChanges({count: new SimpleChange(0, 100, true)});
					});

					it(`should display 99+ after input changed`, async () => {
						expect(await badge.getText()).toContain(expectMaximumCountString);
					});

					it(`should have class ob-longer-badge`, async () => {
						const host = await badge.host();
						expect(await host.hasClass('ob-longer-badge')).toBe(true);
					});
				});

				describe('ngOnchange without any count change', () => {
					it(`should do nothing `, async () => {
						component.ngOnChanges({});
						expect(await badge.getText()).toContain(component.count.toString());
					});
				});
			});
		});
	});

	describe('link', () => {
		let link: TestElement;
		beforeEach(async () => {
			link = await harness.getLink();
		});

		it('should exist', () => {
			expect(link).toBeTruthy();
		});

		it.each([
			{attribute: 'obButton', value: 'secondary'},
			{attribute: 'mat-icon-button', value: ''}
		])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
			expect(await link.getAttribute(attribute)).toBe(value);
		});

		it('should have an "isExternalLink" property set to "false"', async () => {
			expect(await link.getProperty('isExternalLink')).toBe(false);
		});

		it('should have the "ob-widget" class', async () => {
			expect(await link.hasClass('ob-widget')).toBe(true);
		});

		it('should have "i18n.oblique.service-navigation.message.link" as screen reader text', async () => {
			expect(await harness.getLinkScreenReaderText()).toBe('i18n.oblique.service-navigation.message.link');
		});

		describe('tooltip', () => {
			let tooltip: MatTooltipHarness;

			beforeEach(async () => {
				tooltip = await harness.getTooltipHarness();
			});

			it('should be defined', () => {
				expect(tooltip).toBeTruthy();
			});

			it('should have "i18n.oblique.service-navigation.applications.link.tooltip" as text', async () => {
				await tooltip.show();
				const text = await tooltip.getTooltipText();
				expect(text).toBe('i18n.oblique.service-navigation.message.tooltip.text');
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
				expect(await icon.getName()).toBe('inbox');
			});
		});
	});
});
