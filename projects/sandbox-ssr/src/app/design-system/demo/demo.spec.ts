import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {Demo} from './demo';
import {PLATFORM_ID} from '@angular/core';

describe(Demo.name, () => {
	let fixture: ComponentFixture<Demo>;
	let component: Demo;

	describe.each([
		{platform: 'server', result: true},
		{platform: 'browser', result: false},
	])('$platform', ({platform, result}) => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [Demo],
				providers: [{provide: PLATFORM_ID, useValue: platform}],
			}).compileComponents();
			fixture = TestBed.createComponent(Demo);
			fixture.detectChanges();
			component = fixture.componentInstance;
		});

		test('creation', () => {
			expect(component).toBeTruthy();
		});

		test('module loading', () => {
			expect(customElements.get('ob-demo') === undefined).toBe(result);
		});
	});
});
