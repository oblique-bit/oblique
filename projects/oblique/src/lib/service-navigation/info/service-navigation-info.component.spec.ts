import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObPopoverModule} from '../../popover/popover.module';
import {ObServiceNavigationPopoverSectionComponent} from '../shared/popover-section/service-navigation-popover-section.component';
import {ObServiceNavigationInfoHarness} from './service-navigation-info.harness';
import {ObServiceNavigationInfoComponent} from './service-navigation-info.component';

describe('ObServiceNavigationInfoComponent', () => {
	let component: ObServiceNavigationInfoComponent;
	let fixture: ComponentFixture<ObServiceNavigationInfoComponent>;
	let harness: ObServiceNavigationInfoHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule, MatTooltipModule, ObPopoverModule],
			declarations: [ObServiceNavigationInfoComponent, ObServiceNavigationPopoverSectionComponent, ObMockTranslatePipe]
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
			{attribute: 'obButton', value: 'secondary'},
			{attribute: 'mat-icon-button', value: ''},
			{attribute: 'id', value: 'service-navigation-info-popover-toggle'},
			{attribute: 'placement', value: 'bottom'}
		])('should have an "$attribute" attribute set to "$value"', async ({attribute, value}) => {
			expect(await element.getAttribute(attribute)).toBe(value);
		});

		it('should have "ob-widget" class', async () => {
			expect(await element.hasClass('ob-widget')).toBe(true);
		});

		it('should have "i18n.oblique.service-navigation.info.button" as screen reader text', async () => {
			expect(await harness.getTriggerButtonScreenReaderText()).toBe('i18n.oblique.service-navigation.info.button');
		});

		describe('tooltip', () => {
			let tooltip: MatTooltipHarness;
			beforeEach(async () => {
				tooltip = await harness.getTooltipHarness();
			});

			it('should be defined', () => {
				expect(tooltip).toBeTruthy();
			});

			it('should have "i18n.oblique.service-navigation.info.tooltip" as text', async () => {
				await tooltip.show();
				const text = await tooltip.getTooltipText();
				expect(text).toBe('i18n.oblique.service-navigation.info.tooltip');
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
				expect(await icon.getName()).toBe('help');
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
