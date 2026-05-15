import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {Demo} from './demo';
import {PLATFORM_ID} from '@angular/core';

describe(Demo.name, () => {
	let fixture: ComponentFixture<Demo>;
	let component: Demo;

	describe('server', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [Demo],
				providers: [{provide: PLATFORM_ID, useValue: 'server'}],
			}).compileComponents();
			fixture = TestBed.createComponent(Demo);
			fixture.detectChanges();
			component = fixture.componentInstance;
		});

		test('creation', () => {
			expect(component).toBeTruthy();
		});

		test('module loading', () => {
			expect(customElements.get('ob-demo') === undefined).toBe(true);
		});
	});

	describe('browser', () => {
		beforeEach(async () => {
			await import('@oblique/design-system');
			await TestBed.configureTestingModule({
				imports: [Demo],
				providers: [{provide: PLATFORM_ID, useValue: 'browser'}],
			}).compileComponents();
			fixture = TestBed.createComponent(Demo);
			fixture.detectChanges();
			component = fixture.componentInstance;
		});

		test('creation', () => {
			expect(component).toBeTruthy();
		});

		test('module loading', () => {
			expect(customElements.get('ob-demo') === undefined).toBe(false);
		});
	});
});
