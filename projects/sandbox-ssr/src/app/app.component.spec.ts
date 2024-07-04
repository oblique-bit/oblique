import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';

describe(AppComponent.name, () => {
	let fixture: ComponentFixture<AppComponent>;
	let app: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent]
		}).compileComponents();
		fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		app = fixture.componentInstance;
	});

	test('app creation', () => {
		expect(app).toBeTruthy();
	});

	test(`'sandbox-ssr' title`, () => {
		expect(app.title).toEqual('sandbox-ssr');
	});

	test('H1 title', () => {
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('h1')?.textContent).toContain('Hello, sandbox-ssr');
	});
});
