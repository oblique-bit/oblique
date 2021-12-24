import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {ObMasterLayoutComponentService} from './master-layout.component.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObMasterLayoutConfig} from '../master-layout.config';

describe('ObMasterLayoutComponentService', () => {
	let service: ObMasterLayoutComponentService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObMasterLayoutComponentService,
				{
					provide: ObMasterLayoutConfig,
					useValue: {layout: {hasCover: false, hasOffCanvas: false, hasMainNavigation: false, hasLayout: false, hasMaxWidth: false}}
				}
			]
		});
		service = TestBed.inject(ObMasterLayoutComponentService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('configEvents$', () => {
		it('should expose a configEvents$ observable', () => {
			expect(service.configEvents$ instanceof Observable).toBe(true);
		});
	});

	testSetter('isMenuOpened', 'IS_MENU_OPENED');
	testSetter('hasCover', 'LAYOUT_HAS_COVER');
	testSetter('hasOffCanvas', 'LAYOUT_HAS_OFF_CANVAS');
	testSetter('hasMainNavigation', 'LAYOUT_HAS_MAIN_NAVIGATION');
	testSetter('hasLayout', 'LAYOUT_HAS_DEFAULT_LAYOUT');
	testSetter('hasMaxWidth', 'LAYOUT_HAS_MAX_WIDTH');

	function testSetter(property: string, enumValue: string): void {
		describe(property, () => {
			it('should return false', () => {
				expect(service[property]).toBe(false);
			});

			describe('when given a value', () => {
				let event: ObIMasterLayoutEvent;
				beforeEach(done => {
					service.configEvents$.pipe(first()).subscribe(evt => {
						event = evt;
						done();
					});
					service[property] = true;
				});

				it(`should emit a ${enumValue} event`, () => {
					expect(event.name).toBe(ObEMasterLayoutEventValues[enumValue]);
				});

				it('should emit a value', () => {
					expect(event.value).toBe(true);
				});
			});
		});
	}
});
