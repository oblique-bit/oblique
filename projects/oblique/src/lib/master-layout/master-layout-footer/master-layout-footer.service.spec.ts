import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {ObMasterLayoutFooterService} from './master-layout-footer.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {first} from 'rxjs/operators';

describe('ObMasterLayoutFooterService', () => {
	let service: ObMasterLayoutFooterService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObMasterLayoutFooterService,
				{
					provide: ObMasterLayoutConfig,
					useValue: {
						footer: {
							isCustom: false,
							isSticky: false,
							hasLogoOnScroll: false
						}
					}
				}
			]
		});
		service = TestBed.inject(ObMasterLayoutFooterService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('configEvents$', () => {
		it('should expose a configEvents$ observable', () => {
			expect(service.configEvents$ instanceof Observable).toBe(true);
		});
	});
	testSetter('isCustom', 'FOOTER_IS_CUSTOM');
	testSetter('isSticky', 'FOOTER_IS_STICKY');
	testSetter('hasLogoOnScroll', 'FOOTER_HAS_LOGO_ON_SCROLL');

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
