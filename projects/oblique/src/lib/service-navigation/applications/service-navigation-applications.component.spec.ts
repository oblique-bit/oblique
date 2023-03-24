import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObServiceNavigationApplicationsHarness} from './service-navigation-applications.harness';
import {ObServiceNavigationApplicationsComponent} from './service-navigation-applications.component';

describe('ObServiceNavigationApplicationsComponent', () => {
	let component: ObServiceNavigationApplicationsComponent;
	let fixture: ComponentFixture<ObServiceNavigationApplicationsComponent>;
	let harness: ObServiceNavigationApplicationsHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatButtonModule, MatIconModule, MatTooltipModule],
			declarations: [ObServiceNavigationApplicationsComponent, ObMockTranslatePipe],
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

	describe('trigger', () => {
		let trigger: TestElement;
		beforeEach(async () => {
			fixture.detectChanges();
			trigger = await harness.getTrigger();
		});

		it(`should be a link`, async () => {
			expect(await trigger.matchesSelector('a')).toBe(true);
		});

		it.each([
			{attribute: 'id', val: `service-navigation-applications-link`},
			{attribute: 'obButton', val: 'secondary'},
			{attribute: 'mat-icon-button', val: ''},
			{attribute: 'href', val: ''}
		])('should have "$val" as "$attribute" attribute', async ({attribute, val}) => {
			expect(await trigger.getAttribute(attribute)).toBe(val);
		});

		it('should have "false" as "isExternalLink" property', async () => {
			expect(await trigger.getProperty('isExternalLink')).toBe(false);
		});

		it('should have "ob-widget" class', async () => {
			expect(await trigger.hasClass('ob-widget')).toBe(true);
		});

		it('should have "i18n.oblique.service-navigation.applications.link.label" as text', async () => {
			expect(await harness.getTriggerScreenReaderText()).toBe('i18n.oblique.service-navigation.applications.link.label');
		});

		describe('tooltip', () => {
			let tooltipHarness: MatTooltipHarness;

			beforeEach(async () => {
				tooltipHarness = await harness.getTooltipHarness(fixture);
			});

			it('should exist', () => {
				expect(tooltipHarness).toBeTruthy();
			});

			it(`should have "i18n.oblique.service-navigation.applications.link.tooltip" as text`, async () => {
				await tooltipHarness.show();
				expect(await tooltipHarness.getTooltipText()).toBe(`i18n.oblique.service-navigation.applications.link.tooltip`);
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
});
