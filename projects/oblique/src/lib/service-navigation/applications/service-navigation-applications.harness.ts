import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture} from '@angular/core/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';
import {ObServiceNavigationApplicationsComponent} from './service-navigation-applications.component';

export class ObServiceNavigationApplicationsHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation-applications';

	public async getTrigger(): Promise<TestElement> {
		return this.locatorForOptional('button', 'a')();
	}

	public async getTriggerScreenReaderText(): Promise<string> {
		const element = await this.locatorForOptional('button .ob-screen-reader-only', 'a .ob-screen-reader-only')();
		return element.text();
	}

	public getTooltipHarness(fixture: ComponentFixture<ObServiceNavigationApplicationsComponent>): Promise<MatTooltipHarness> {
		return TestbedHarnessEnvironment.documentRootLoader(fixture).getHarnessOrNull(MatTooltipHarness);
	}

	public getIconHarness(fixture: ComponentFixture<ObServiceNavigationApplicationsComponent>): Promise<MatIconHarness> {
		return TestbedHarnessEnvironment.documentRootLoader(fixture).getHarnessOrNull(MatIconHarness);
	}
}
