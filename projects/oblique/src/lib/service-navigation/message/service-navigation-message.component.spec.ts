import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
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
			imports: [MatTooltipModule, ObTranslateParamsModule, MatIconModule],
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
