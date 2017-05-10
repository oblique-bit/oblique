/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {LayoutManagerService} from './layout-manager.service';

describe('LayoutManagerService', () => {
	let uiLayoutService: LayoutManagerService;

	beforeEach(async() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				LayoutManagerService,
			]
		});
	});

	beforeEach(inject([LayoutManagerService], (service: LayoutManagerService) => {
		uiLayoutService = service;
	}));

	it('update layout variant', () => {
		// TODO
	});
});
