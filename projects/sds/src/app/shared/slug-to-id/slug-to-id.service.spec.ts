import {TestBed} from '@angular/core/testing';

import {SlugToIdService} from './slug-to-id.service';

describe(`${SlugToIdService.name}`, () => {
	let service: SlugToIdService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SlugToIdService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe(`${SlugToIdService.prototype.setupDataSet.name}`, () => {
		it('should emit readyToMap once', () => {
			jest.spyOn(service.readyToMap, 'next');

			service.setupDataSet(new Map<string, number>());

			expect(service.readyToMap.next).toHaveBeenCalledTimes(1);
		});
	});

	describe(`${SlugToIdService.prototype.getIdForSlug.name}`, () => {
		beforeEach(() => {
			service.setupDataSet(
				new Map<string, number>([
					['slug-1', 1],
					['slug-2', 2],
					['slug-3', 3]
				])
			);
		});

		it.each([
			{slug: 'slug-1', id: 1},
			{slug: 'slug-2', id: 2},
			{slug: 'slug-3', id: 3}
		])('should give the id $id for slug $slug', ({slug, id}) => {
			expect(service.getIdForSlug(slug)).toBe(id);
		});
	});
});
