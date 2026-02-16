import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {SlugService} from './slug.service';

describe(SlugService.name, () => {
	let service: SlugService;
	const url = '/category/slug-1';
	const routerMock = {url: ''};
	const pages = [
		{slug: 'slug', minVersion: 1, maxVersion: 1},
		{slug: 'slug-1', minVersion: 2, maxVersion: 2},
		{slug: 'slug-2', minVersion: 3, maxVersion: 5},
	];

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: Router, useValue: routerMock}],
		});
		service = TestBed.inject(SlugService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe(SlugService.prototype.getNewSlug.name, () => {
		describe.each([{params: ''}, {params: '/api?foo=bar#section'}])('$params', ({params}) => {
			beforeEach(() => {
				routerMock.url = url + params;
			});

			it('should return undefined without matching page', () => {
				expect(service.getNewSlug(1, [])).toBeUndefined();
			});

			it.each([
				{desc: 'a valid page', version: 2, result: undefined},
				{desc: 'a page above max', version: 3, result: 'slug-2'},
				{desc: 'a page below min', version: 1, result: 'slug'},
				{desc: 'an invalid page', version: 6, result: 'invalid'},
			] as {desc: string; version: number; result: string}[])(
				'should return $result with $desc',
				({version, result}) => {
					expect(service.getNewSlug(version, pages)).toBe(result);
				}
			);
		});
	});
});
