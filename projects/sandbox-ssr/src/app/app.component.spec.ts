import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {AppComponent} from './app.component';
import {routes} from './app.routes';

describe(AppComponent.name, () => {
	let fixture: ComponentFixture<AppComponent>;
	let app: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent],
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
});
