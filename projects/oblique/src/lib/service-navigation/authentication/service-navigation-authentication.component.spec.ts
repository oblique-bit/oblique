import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconHarness} from '@angular/material/icon/testing';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObServiceNavigationAuthenticationHarness} from './service-navigation-authentication.harness';
import {ObServiceNavigationAuthenticationComponent} from './service-navigation-authentication.component';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {ObButtonModule} from '../../button/button.module';

describe('ObServiceNavigationAuthenticationComponent', () => {
	let component: ObServiceNavigationAuthenticationComponent;
	let fixture: ComponentFixture<ObServiceNavigationAuthenticationComponent>;
	let harness: ObServiceNavigationAuthenticationHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ObServiceNavigationAuthenticationComponent],
			imports: [ObMockTranslatePipe, MatIconModule, MatTooltipModule, MatButtonModule, ObButtonModule]
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

	describe('with "loginUrl" as "loginUrl" and "logoutUrl" as "logoutUrl"', () => {
		beforeEach(() => {
			component.loginUrl = 'loginUrl';
		});

		describe('isLoggedIn', () => {
			it('should be initialized to "false"', () => {
				expect(component.isLoggedIn).toBe(false);
			});

			describe('set to "true"', () => {
				beforeEach(() => {
					component.isLoggedIn = true;
					fixture.detectChanges();
				});

				describe('link', () => {
					it('should not exist', async () => {
						expect(await harness.getLinkElement()).toBeNull();
					});
				});

				describe('button', () => {
					let button: TestElement;
					beforeEach(async () => {
						button = await harness.getButtonElement();
					});

					it('should exist', () => {
						expect(button).toBeTruthy();
					});

					it.each([
						{attribute: 'obButton', value: 'secondary'},
						{attribute: 'mat-button', value: ''},
						{attribute: 'id', value: 'ob-service-navigation-authentication-button-to-logout'},
						{attribute: 'type', value: 'button'},
						{attribute: 'role', value: 'link'}
					])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
						expect(await button.getAttribute(attribute)).toBe(value);
					});

					it('should have "ob-widget" class', async () => {
						expect(await button.hasClass('ob-widget')).toBe(true);
					});

					it('should have "i18n.oblique.service-navigation.authentication.logout" as text', async () => {
						expect(await harness.getButtonText()).toBe('i18n.oblique.service-navigation.authentication.logout');
					});

					describe('on click', () => {
						beforeEach(() => {
							jest.spyOn(component.logoutClicked, 'emit');
							button.click();
						});

						it('should call the logoutClicked Emitter once', () => {
							expect(component.logoutClicked.emit).toHaveBeenCalledTimes(1);
						});
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

						it('should be "logout"', async () => {
							expect(await (await harness.getIconHarness()).getName()).toBe('logout');
						});
					});
				});
			});

			describe('set to "false"', () => {
				beforeEach(() => {
					component.isLoggedIn = false;
					fixture.detectChanges();
				});

				describe('link', () => {
					it('should be displayed', async () => {
						expect(await harness.getLinkElement()).toBeTruthy();
					});

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

					describe('button', () => {
						it('should not be displayed', async () => {
							expect(await harness.getButtonElement()).toBe(null);
						});
					});
				});
			});
		});
	});
});
