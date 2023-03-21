import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
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

	describe('with "loginUrl" as "loginUrl" and "logoutUrl" as "logoutUrl"', () => {
		beforeEach(() => {
			component.loginUrl = 'loginUrl';
			component.logoutUrl = 'logoutUrl';
		});

		describe('isLoggedIn', () => {
			it('should be initialized to "false"', () => {
				expect(component.isLoggedIn).toBe(false);
			});

			describe.each([false, true])('set to "%s"', isLoggedIn => {
				beforeEach(() => {
					component.isLoggedIn = isLoggedIn;
					fixture.detectChanges();
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

					describe('tooltip', () => {
						it('should exist', async () => {
							expect(await harness.getTooltipHarness()).toBeTruthy();
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
					});
				});
			});

			describe('set to "false" ', () => {
				beforeEach(() => {
					component.isLoggedIn = false;
					fixture.detectChanges();
				});

				describe('link', () => {
					it.each([
						{attribute: 'href', value: 'loginUrl'},
						{attribute: 'id', value: 'ob-service-navigation-authentication-link-to-login'}
					])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
						expect(await (await harness.getLinkElement()).getAttribute(attribute)).toBe(value);
					});

					it('should have "i18n.oblique.service-navigation.authentication.login" as text', async () => {
						expect(await harness.getText()).toBe('i18n.oblique.service-navigation.authentication.login');
					});

					describe('tooltip', () => {
						it('should have "i18n.oblique.service-navigation.authentication.tooltip.login" as text', async () => {
							const tooltipHarness = await harness.getTooltipHarness();
							await tooltipHarness.show();
							const text = await tooltipHarness.getTooltipText();
							expect(text).toBe('i18n.oblique.service-navigation.authentication.tooltip.login');
						});
					});

					describe('icon', () => {
						it('should be "login"', async () => {
							expect(await (await harness.getIconHarness()).getName()).toBe('login');
						});
					});
				});
			});

			describe('set to "true" ', () => {
				beforeEach(() => {
					component.isLoggedIn = true;
					fixture.detectChanges();
				});

				describe('link', () => {
					it.each([
						{attribute: 'href', value: 'logoutUrl'},
						{attribute: 'id', value: 'ob-service-navigation-authentication-link-to-logout'}
					])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
						expect(await (await harness.getLinkElement()).getAttribute(attribute)).toBe(value);
					});

					it('should have "i18n.oblique.service-navigation.authentication.logout" as text', async () => {
						expect(await harness.getText()).toBe('i18n.oblique.service-navigation.authentication.logout');
					});

					describe('icon', () => {
						it('should be "logout"', async () => {
							expect(await (await harness.getIconHarness()).getName()).toBe('logout');
						});
					});
				});
			});
		});
	});
});
