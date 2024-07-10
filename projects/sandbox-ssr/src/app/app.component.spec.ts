import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {AppComponent} from './app.component';
import {routes} from './app.routes';
import {MatButtonToggle} from '@angular/material/button-toggle';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatButtonToggleGroupHarness} from '@angular/material/button-toggle/testing';

describe(AppComponent.name, () => {
	let fixture: ComponentFixture<AppComponent>;
	let app: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent, TranslateModule.forRoot(), MatButtonToggle],
			providers: [provideRouter(routes)]
		}).compileComponents();
		fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		app = fixture.componentInstance;
	});

	test('app creation', () => {
		expect(app).toBeTruthy();
	});

	test('side navigation presence', () => {
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('nav')).toBeTruthy();
	});

	test('router-outlet presence', () => {
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('router-outlet')).toBeTruthy();
	});

	describe('language selection', () => {
		let harness: MatButtonToggleGroupHarness | null;
		beforeEach(async () => {
			const loader = TestbedHarnessEnvironment.loader(fixture);
			harness = await loader.getHarnessOrNull(MatButtonToggleGroupHarness);
		});

		test('presence', () => {
			expect(harness).toBeDefined();
		});

		test('presence of 2 language toggles', async () => {
			expect((await harness!.getToggles()).length).toBe(2);
		});

		test('language change', async () => {
			const translateService = TestBed.inject(TranslateService);
			jest.spyOn(translateService, 'use');
			await (await harness!.getToggles())[1].check();
			expect(translateService.use).toHaveBeenCalledWith('fr');
		});
	});
});
