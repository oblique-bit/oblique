import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture} from '@angular/core/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {ObServiceNavigationPopOverHarness} from '../shared/popover-section/service-navigation-popover.harness';
import {ObServiceNavigationApplicationsComponent} from './service-navigation-applications.component';

export class ObServiceNavigationApplicationsHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation-applications';
	static allFavoriteLinkSelector = '#service-navigation-all-favorite-services';
	private static readonly popoverSelector = '#ob-service-navigation-applications-popover-content';

	public async getTrigger(): Promise<TestElement> {
		return this.locatorForOptional('button', 'a')();
	}

	public async getTriggerScreenReaderText(): Promise<string> {
		const element = await this.locatorForOptional('button .ob-screen-reader-only', 'a .ob-screen-reader-only')();
		return element.text();
	}

	public async getPopover(): Promise<TestElement> {
		return this.locatorForOptional(ObServiceNavigationApplicationsHarness.popoverSelector)();
	}

	public getTooltipHarness(fixture: ComponentFixture<ObServiceNavigationApplicationsComponent>): Promise<MatTooltipHarness> {
		return TestbedHarnessEnvironment.documentRootLoader(fixture).getHarnessOrNull(MatTooltipHarness);
	}

	public getAllTooltipHarness(fixture: ComponentFixture<ObServiceNavigationApplicationsComponent>): Promise<MatTooltipHarness[]> {
		return TestbedHarnessEnvironment.documentRootLoader(fixture).getAllHarnesses(MatTooltipHarness);
	}

	public getIconHarness(fixture: ComponentFixture<ObServiceNavigationApplicationsComponent>): Promise<MatIconHarness> {
		return TestbedHarnessEnvironment.documentRootLoader(fixture).getHarnessOrNull(MatIconHarness);
	}

	public async openPopover(): Promise<void> {
		const trigger = await this.getTrigger();
		return trigger.click();
	}

	public async getPopoverHarness(): Promise<ObServiceNavigationPopOverHarness> {
		return this.getHarnessOrNull(ObServiceNavigationPopOverHarness);
	}

	public getAllServicesLink(): Promise<TestElement> {
		return this.locatorFor('#service-navigation-all-services')();
	}

	public getAllFavoriteServicesLink(): Promise<TestElement> {
		return this.locatorFor(ObServiceNavigationApplicationsHarness.allFavoriteLinkSelector)();
	}
}
