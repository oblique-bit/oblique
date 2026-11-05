import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {TextSample} from './text-sample';

describe(TextSample.name, () => {
	let component: TextSample;
	let fixture: ComponentFixture<TextSample>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TextSample],
		}).compileComponents();

		fixture = TestBed.createComponent(TextSample);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('component creation', () => {
		expect(component).toBeTruthy();
	});

	test('starts with a click count of 0', () => {
		expect(component.clicks()).toBe(0);
	});

	test('increments the click count', () => {
		component.increment();
		expect(component.clicks()).toBe(1);
	});

	test('renders the click count', () => {
		component.increment();
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('Clicked 1 times');
	});

	test('increments when the button is clicked', () => {
		const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
		button.click();
		fixture.detectChanges();
		expect(component.clicks()).toBe(1);
	});
});
