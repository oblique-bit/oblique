import {TestBed} from '@angular/core/testing';
import {DOCUMENT} from '@angular/core';
import {WINDOW, obProvideWindow} from './window.provider';
import {ObWindow} from './window.provider.model';

describe('window', () => {
	describe(obProvideWindow.name, () => {
		describe('with window', () => {
			beforeEach(() => {
				TestBed.configureTestingModule({providers: [{provide: DOCUMENT, useValue: document}, obProvideWindow()]});
			});

			test('provides WINDOW', () => {
				expect(TestBed.inject(WINDOW)).toEqual(window);
			});
		});

		describe('without window', () => {
			let win: ObWindow;

			beforeEach(() => {
				TestBed.configureTestingModule({providers: [{provide: DOCUMENT, useValue: {}}, obProvideWindow()]});
				win = TestBed.inject(WINDOW);
			});

			test('does not provide WINDOW', () => {
				expect(win).not.toEqual(window);
			});

			test('confirm function returns a boolean', () => {
				expect(typeof win.confirm('')).toBe('boolean');
			});

			test('history.length property is a number', () => {
				expect(typeof win.history.length).toBe('number');
			});

			test('innerHeight property is a number', () => {
				expect(typeof win.innerHeight).toBe('number');
			});

			test('innerWidth property is a number', () => {
				expect(typeof win.innerWidth).toBe('number');
			});

			test('localStorage.getItem function returns a string', () => {
				expect(typeof win.localStorage.getItem('key')).toBe('string');
			});

			test('localStorage.setItem function exists', () => {
				expect(() => win.localStorage.setItem('key', '')).not.toThrow();
			});

			test('localStorage.removeItem function exists', () => {
				expect(() => win.localStorage.removeItem('key')).not.toThrow();
			});

			test('location.href property is a string', () => {
				expect(typeof win.location.href).toBe('string');
			});

			test('location.host property is a string', () => {
				expect(typeof win.location.host).toBe('string');
			});

			test('matchMedia function returns an object with a matches property', () => {
				expect(typeof win.matchMedia('(min-width: 600px)').matches).toBe('boolean');
			});

			test('open function', () => {
				expect(() => win.open('https://example.com', '_blank')).not.toThrow();
			});

			test('pageYOffset property is a number', () => {
				expect(typeof win.pageYOffset).toBe('number');
			});

			test('setTimeout function that returns a number', () => {
				expect(typeof win.setTimeout(() => {})).toBe('number');
			});

			test('setInterval function that returns a number', () => {
				expect(typeof win.setInterval(() => {})).toBe('number');
			});
		});
	});
});
