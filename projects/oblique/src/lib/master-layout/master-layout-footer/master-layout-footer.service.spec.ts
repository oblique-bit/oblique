import {TestBed} from '@angular/core/testing';
import {Observable, firstValueFrom} from 'rxjs';
import {ObMasterLayoutFooterService} from './master-layout-footer.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObMasterLayoutConfig} from '../master-layout.config';

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
						},
					},
				},
			],
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

	function testSetter(property: string, enumValue: string): void {
		describe(property, () => {
			it('should return false', () => {
				expect(service[property]).toBe(false);
			});

			describe('when given a value', () => {
				let event: ObIMasterLayoutEvent;
				beforeEach(async () => {
					const eventPromise = firstValueFrom(service.configEvents$);
					service[property] = true;
					event = await eventPromise;
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
