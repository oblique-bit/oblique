import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {Icon} from './icon';
import {PLATFORM_ID} from '@angular/core';

describe(Icon.name, () => {
	let fixture: ComponentFixture<Icon>;
	let component: Icon;

	describe('server', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [Icon],
				providers: [{provide: PLATFORM_ID, useValue: 'server'}],
			}).compileComponents();
			fixture = TestBed.createComponent(Icon);
			fixture.detectChanges();
			component = fixture.componentInstance;
		});

		test('creation', () => {
			expect(component).toBeTruthy();
		});
	});

	describe('browser', () => {
		beforeEach(async () => {
			await import('@oblique/design-system');
			await TestBed.configureTestingModule({
				imports: [Icon],
				providers: [{provide: PLATFORM_ID, useValue: 'browser'}],
			}).compileComponents();
			fixture = TestBed.createComponent(Icon);
			fixture.detectChanges();
			component = fixture.componentInstance;
		});

		test('creation', () => {
			expect(component).toBeTruthy();
		});

		test('module loading', () => {
			expect(customElements.get('ob-icon') === undefined).toBe(false);
		});
	});
});
