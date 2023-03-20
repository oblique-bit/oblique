import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObServiceNavigationAuthenticationHarness} from './service-navigation-authentication.harness';
import {ObServiceNavigationAuthenticationComponent} from './service-navigation-authentication.component';

describe('ObServiceNavigationAuthenticationComponent', () => {
	let component: ObServiceNavigationAuthenticationComponent;
	let fixture: ComponentFixture<ObServiceNavigationAuthenticationComponent>;
	let harness: ObServiceNavigationAuthenticationHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ObServiceNavigationAuthenticationComponent, ObMockTranslatePipe],
			imports: [MatIconModule, MatTooltipModule]
		}).compileComponents();

		fixture = TestBed.createComponent(ObServiceNavigationAuthenticationComponent);
		component = fixture.componentInstance;
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationAuthenticationHarness);
	});

	it('should create component instance', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-service-navigation-authentication" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation-authentication')).toBe(true);
	});

	it('should have an empty "loginUrl" property', () => {
		expect(component.loginUrl).toBe('');
	});

	it('should have an empty "logoutUrl" property', () => {
		expect(component.logoutUrl).toBe('');
	});

	describe('link', () => {
		let link: TestElement;
		beforeEach(async () => {
			link = await harness.getLinkElement();
		});

		it('should exist', () => {
			expect(link).toBeTruthy();
		});

		it.each([
			{attribute: 'href', value: ''},
			{attribute: 'id', value: 'ob-service-navigation-authentication-link-to-login'},
			{attribute: 'icon', value: 'none'},
			{attribute: 'obButton', value: 'secondary'},
			{attribute: 'mat-button', value: ''}
		])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
			expect(await link.getAttribute(attribute)).toBe(value);
		});

		it('should have an "isExternalLink" property set to "false"', async () => {
			expect(await link.getProperty('isExternalLink')).toBe(false);
		});

		it('should have "ob-widget" class', async () => {
			expect(await link.hasClass('ob-widget')).toBe(true);
		});

		it('should have "i18n.oblique.service-navigation.authentication.login" as text', async () => {
			const text = await harness.getText();
			expect(text).toBe('i18n.oblique.service-navigation.authentication.login');
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
				expect(text).toBe('i18n.oblique.service-navigation.authentication.tooltip.login');
			});
		});

		describe('icon', () => {
			let iconHarness: MatIconHarness;
			beforeEach(async () => {
				iconHarness = await harness.getIconHarness();
			});

			it('should exists', () => {
				expect(iconHarness).toBeTruthy();
			});

			it('should be "icon"', async () => {
				expect(await iconHarness.getName()).toBe('login');
			});
		});

		describe(`with LoginURL as "loginUrl"`, () => {
			beforeEach(() => {
				component.loginUrl = 'LoginURL';
				fixture.detectChanges();
			});

			it('should have an "href" attribute set to "LoginURL"', async () => {
				expect(await link.getAttribute('href')).toBe('LoginURL');
			});
		});
	});
});
