import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObMasterLayoutNavigationGoToChildrenComponent} from './master-layout-navigation-go-to-children.component';
import {ObMasterLayoutNavigationGoToChildrenHarness} from './master-layout-navigation-go-to-children.harness';
import {ObMockTranslateService} from '../../../_mocks/mock-translate.service';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TranslateService} from '@ngx-translate/core';

describe(ObMasterLayoutNavigationGoToChildrenComponent.name, () => {
	let component: ObMasterLayoutNavigationGoToChildrenComponent;
	let fixture: ComponentFixture<ObMasterLayoutNavigationGoToChildrenComponent>;
	let harness: ObMasterLayoutNavigationGoToChildrenHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}],
		}).compileComponents();

		fixture = TestBed.createComponent(ObMasterLayoutNavigationGoToChildrenComponent);
		component = fixture.componentInstance;
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObMasterLayoutNavigationGoToChildrenHarness);
		fixture.autoDetectChanges();
		await fixture.whenStable();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test('that button is shown by default', async () => {
		await expect(harness.getButton()).resolves.toBeTruthy();
	});

	test('that button is hidden when hide is set to true', async () => {
		component.hide = true;
		await expect(harness.getButton()).rejects.toBeTruthy();
	});
});
