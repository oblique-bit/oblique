import {TestBed} from '@angular/core/testing';
import {ObMasterLayoutHeaderService} from './master-layout-header.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {ObMasterLayoutConfig} from '../master-layout.config';

describe('ObMasterLayoutHeaderService', () => {
	let service: ObMasterLayoutHeaderService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObMasterLayoutHeaderService,
				{
					provide: ObMasterLayoutConfig,
					useValue: {
						header: {
							isCustom: false,
							isSmall: false,
							isSticky: false,
							reduceOnScroll: false,
							serviceNavigation: {}
						}
					}
				}
			]
		});
		service = TestBed.inject(ObMasterLayoutHeaderService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('configEvents$', () => {
		it('should expose a configEvents$ observable', () => {
			expect(service.configEvents$ instanceof Observable).toBe(true);
		});
	});

	describe('loginState$', () => {
		it('should expose a loginState$ observable', () => {
			expect(service.loginState$ instanceof Observable).toBe(true);
		});
	});

	describe('emitLoginState', () => {
		it('should emit the given state through loginState$', done => {
			service.loginState$.subscribe(loginState => {
				expect(loginState).toBe('SA');
				done();
			});
			service.emitLoginState('SA');
		});
	});

	testSetter('isCustom', 'HEADER_IS_CUSTOM');
	testSetter('isSmall', 'HEADER_IS_SMALL');
	testSetter('isSticky', 'HEADER_IS_STICKY');
	testSetter('reduceOnScroll', 'HEADER_REDUCE_ON_SCROLL');

	describe('serviceNavigationConfiguration', () => {
		it('should return en empty object', () => {
			expect(service.serviceNavigationConfiguration).toEqual({});
		});

		describe('when given a value', () => {
			let event: ObIMasterLayoutEvent;
			beforeEach(done => {
				service.configEvents$.pipe(first()).subscribe(evt => {
					event = evt;
					done();
				});
				service.serviceNavigationConfiguration = {displayInfo: true};
			});

			it(`should emit a SERVICE_NAVIGATION_CONFIGURATION event`, () => {
				expect(event.name).toBe(ObEMasterLayoutEventValues.SERVICE_NAVIGATION_CONFIGURATION);
			});

			it('should emit a value', () => {
				expect(event.config).toEqual({displayInfo: true});
			});
		});
	});

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
