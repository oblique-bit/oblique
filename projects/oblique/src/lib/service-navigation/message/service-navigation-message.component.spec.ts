import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBadgeHarness} from '@angular/material/badge/testing';
import {MatIconModule} from '@angular/material/icon';
import {TranslateService} from '@ngx-translate/core';
import {ObTranslateParamsModule} from '../../translate-params/translate-params.module';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObServiceNavigationMessageHarness} from './service-navigation-message.harness';
import {ObServiceNavigationMessageComponent} from './service-navigation-message.component';

describe('ObServiceNavigationMessageComponent', () => {
	let component: ObServiceNavigationMessageComponent;
	let fixture: ComponentFixture<ObServiceNavigationMessageComponent>;
	let harness: ObServiceNavigationMessageHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatTooltipModule, ObTranslateParamsModule, MatIconModule, MatBadgeModule],
			declarations: [ObServiceNavigationMessageComponent, ObMockTranslatePipe],
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

				it('should be small', async () => {
					expect(await badge.getSize()).toBe('small');
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
