import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TestElement} from '@angular/cdk/testing';
import {ObServiceNavigationComponent} from './service-navigation.component';
import {ObServiceNavigationHarness} from './service-navigation.harness';

describe('ObServiceNavigationComponent', () => {
	let component: ObServiceNavigationComponent;
	let fixture: ComponentFixture<ObServiceNavigationComponent>;
	let harness: ObServiceNavigationHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ObServiceNavigationComponent]
		}).compileComponents();
	});

	beforeEach(async () => {
		fixture = TestBed.createComponent(ObServiceNavigationComponent);
		component = fixture.componentInstance;
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationHarness);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-service-navigation" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation')).toBe(true);
	});

	describe('list', () => {
		let list: TestElement;
		beforeEach(async () => {
			list = await harness.getListElement();
		});

		it('should be present', () => {
			expect(list).toBeTruthy();
		});

		it('should have "ob-service-navigation-list" class', async () => {
			expect(await list.hasClass('ob-service-navigation-list')).toBe(true);
		});

		it('should have no children', async () => {
			expect((await harness.getListItemElements()).length).toBe(0);
		});
	});
});
