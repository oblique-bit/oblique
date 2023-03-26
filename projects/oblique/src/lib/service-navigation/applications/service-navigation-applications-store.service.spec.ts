import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {WINDOW} from '../../utilities';
import {ObIServiceNavigationApplicationInfo} from '../api/service-navigation.api.model';
import {ObServiceNavigationApplicationsStoreService} from './service-navigation-applications-store.service';
import {ObServiceNavigationApplicationsApiService} from '../api/service-navigation-applications-api.service';

describe('ObServiceNavigationApplicationsStoreService', () => {
	let service: ObServiceNavigationApplicationsStoreService;
	let applicationService: ObServiceNavigationApplicationsApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: ObServiceNavigationApplicationsApiService, useValue: {fetchApplicationsInfo: jest.fn()}}]
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe.each([
		{description: 'without window', useWindow: undefined},
		{description: 'with window, without localStorage', useWindow: {}}
	])('$description', ({useWindow}) => {
		beforeEach(() => {
			if (useWindow) {
				TestBed.overrideProvider(WINDOW, {useValue: useWindow});
			}
			service = TestBed.inject(ObServiceNavigationApplicationsStoreService);
			applicationService = TestBed.inject(ObServiceNavigationApplicationsApiService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		describe('fetchApplicationsInfo', () => {
			describe('one run', () => {
				let result: ObIServiceNavigationApplicationInfo[];
				const mockData = buildMockData(1);
				beforeEach(done => {
					jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
					service
						.fetchApplicationsInfo('rootUrl', [
							{
								applicationID: 1,
								childApplicationID: 0
							}
						])
						.subscribe(data => {
							result = data;
							done();
						});
				});

				it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo once', () => {
					expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledTimes(1);
				});

				it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo with the same parameters', () => {
					expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledWith('rootUrl', [
						{
							applicationID: 1,
							childApplicationID: 0
						}
					]);
				});

				it('should return mockData', () => {
					expect(result).toEqual(mockData);
				});
			});

			describe('two identical runs', () => {
				const results: ObIServiceNavigationApplicationInfo[][] = [];
				const mockData = buildMockData(1);
				beforeEach(done => {
					jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
					service
						.fetchApplicationsInfo('rootUrl', [
							{
								applicationID: 1,
								childApplicationID: 0
							}
						])
						.subscribe(data => {
							results.push(data);
							done();
						});
				});
				beforeEach(done => {
					jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
					service
						.fetchApplicationsInfo('rootUrl', [
							{
								applicationID: 1,
								childApplicationID: 0
							}
						])
						.subscribe(data => {
							results.push(data);
							done();
						});
				});

				it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo once', () => {
					expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledTimes(1);
				});

				it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo', () => {
					expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledWith('rootUrl', [
						{
							applicationID: 1,
							childApplicationID: 0
						}
					]);
				});

				it.each([0, 1])('should return mockData for the %sth result', index => {
					expect(results[index]).toEqual(mockData);
				});
			});

			describe('two runs with different inputs', () => {
				const mockData = buildMockData(1, 2);
				const results: ObIServiceNavigationApplicationInfo[][] = [];
				beforeEach(done => {
					jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of([mockData[0]]));
					service
						.fetchApplicationsInfo('rootUrl', [
							{
								applicationID: 1,
								childApplicationID: 0
							}
						])
						.subscribe(data => {
							results.push(data);
							done();
						});
				});

				beforeEach(done => {
					jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of([mockData[1]]));
					service
						.fetchApplicationsInfo('rootUrl', [
							{
								applicationID: 2,
								childApplicationID: 0
							}
						])
						.subscribe(data => {
							results.push(data);
							done();
						});
				});

				it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo twice', () => {
					expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledTimes(2);
				});

				it.each([
					{index: 1, applicationId: 1},
					{index: 2, applicationId: 2}
				])(
					'should call ObServiceNavigationApplicationsService.fetchApplicationsInfo with "$applicationId" as applicationID',
					({index, applicationId}) => {
						expect(applicationService.fetchApplicationsInfo).toHaveBeenNthCalledWith(index, 'rootUrl', [
							{
								applicationID: applicationId,
								childApplicationID: 0
							}
						]);
					}
				);

				it.each([0, 1])('should return mockData for the %sth result', index => {
					expect(results[index]).toEqual([mockData[index]]);
				});
			});

			describe('two runs with partial different inputs', () => {
				const mockData = buildMockData(1, 2);
				const results: ObIServiceNavigationApplicationInfo[][] = [];
				beforeEach(done => {
					jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of([mockData[0]]));
					service
						.fetchApplicationsInfo('rootUrl', [
							{
								applicationID: 1,
								childApplicationID: 0
							}
						])
						.subscribe(data => {
							results.push(data);
							done();
						});
				});

				beforeEach(done => {
					jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
					service
						.fetchApplicationsInfo('rootUrl', [
							{
								applicationID: 1,
								childApplicationID: 0
							},
							{
								applicationID: 2,
								childApplicationID: 0
							}
						])
						.subscribe(data => {
							results.push(data);
							done();
						});
				});

				it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo twice', () => {
					expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledTimes(2);
				});

				it.each([
					{index: 1, applicationId: 1},
					{index: 2, applicationId: 2}
				])(
					'should call ObServiceNavigationApplicationsService.fetchApplicationsInfo with "$applicationId" as applicationID',
					({index, applicationId}) => {
						expect(applicationService.fetchApplicationsInfo).toHaveBeenNthCalledWith(index, 'rootUrl', [
							{
								applicationID: applicationId,
								childApplicationID: 0
							}
						]);
					}
				);

				it('should return mockData for the first result', () => {
					expect(results[0]).toEqual([mockData[0]]);
				});

				it('should return mockData for the second result', () => {
					expect(results[1]).toEqual(mockData);
				});
			});
		});
	});

	describe('with window', () => {
		beforeEach(() => {
			TestBed.overrideProvider(WINDOW, {useValue: window});
			jest.spyOn(window.localStorage, 'setItem');
		});

		describe('with empty localStorage', () => {
			beforeEach(() => {
				jest.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
				service = TestBed.inject(ObServiceNavigationApplicationsStoreService);
				applicationService = TestBed.inject(ObServiceNavigationApplicationsApiService);
			});

			it('should be created', () => {
				expect(service).toBeTruthy();
			});

			it('should load data from localStorage', () => {
				expect(window.localStorage.getItem).toHaveBeenCalledWith('ObliqueHeaderWidgetApplications');
			});

			describe('fetchApplicationsInfo', () => {
				describe('one run', () => {
					let result: ObIServiceNavigationApplicationInfo[];
					const mockData = buildMockData(1);
					beforeEach(done => {
						jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
						service
							.fetchApplicationsInfo('rootUrl', [
								{
									applicationID: 1,
									childApplicationID: 0
								}
							])
							.subscribe(data => {
								result = data;
								done();
							});
					});

					it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo once', () => {
						expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledTimes(1);
					});

					it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo with the same parameters', () => {
						expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledWith('rootUrl', [
							{
								applicationID: 1,
								childApplicationID: 0
							}
						]);
					});

					it('should store data in localStorage once', () => {
						expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
					});

					it('should store data in localStorage', () => {
						expect(window.localStorage.setItem).toHaveBeenCalledWith(
							'ObliqueHeaderWidgetApplications',
							'{"1":{"applicationID":1,"image":"imageBase64_1","lastModificationDate":"timestamp_1","name":{"en":"EN_1","de":"DE_1","fr":"FR_1","it":"IT_1"},"url":"appUrl_1"}}'
						);
					});

					it('should return mockData', () => {
						expect(result).toEqual(mockData);
					});
				});

				describe('two identical runs', () => {
					const results: ObIServiceNavigationApplicationInfo[][] = [];
					const mockData = buildMockData(1);
					beforeEach(done => {
						jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
						service
							.fetchApplicationsInfo('rootUrl', [
								{
									applicationID: 1,
									childApplicationID: 0
								}
							])
							.subscribe(data => {
								results.push(data);
								done();
							});
					});
					beforeEach(done => {
						jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
						service
							.fetchApplicationsInfo('rootUrl', [
								{
									applicationID: 1,
									childApplicationID: 0
								}
							])
							.subscribe(data => {
								results.push(data);
								done();
							});
					});

					it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo once', () => {
						expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledTimes(1);
					});

					it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo', () => {
						expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledWith('rootUrl', [
							{
								applicationID: 1,
								childApplicationID: 0
							}
						]);
					});

					it('should store data in localStorage once', () => {
						expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
					});

					it('should store data in localStorage', () => {
						expect(window.localStorage.setItem).toHaveBeenCalledWith(
							'ObliqueHeaderWidgetApplications',
							'{"1":{"applicationID":1,"image":"imageBase64_1","lastModificationDate":"timestamp_1","name":{"en":"EN_1","de":"DE_1","fr":"FR_1","it":"IT_1"},"url":"appUrl_1"}}'
						);
					});

					it.each([0, 1])('should return mockData for the %sth result', index => {
						expect(results[index]).toEqual(mockData);
					});
				});

				describe('two runs with different inputs', () => {
					const mockData = buildMockData(1, 2);
					const results: ObIServiceNavigationApplicationInfo[][] = [];
					beforeEach(done => {
						jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of([mockData[0]]));
						service
							.fetchApplicationsInfo('rootUrl', [
								{
									applicationID: 1,
									childApplicationID: 0
								}
							])
							.subscribe(data => {
								results.push(data);
								done();
							});
					});

					beforeEach(done => {
						jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of([mockData[1]]));
						service
							.fetchApplicationsInfo('rootUrl', [
								{
									applicationID: 2,
									childApplicationID: 0
								}
							])
							.subscribe(data => {
								results.push(data);
								done();
							});
					});

					it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo twice', () => {
						expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledTimes(2);
					});

					it.each([
						{index: 1, applicationId: 1},
						{index: 2, applicationId: 2}
					])(
						'should call ObServiceNavigationApplicationsService.fetchApplicationsInfo with "$applicationId" as applicationID',
						({index, applicationId}) => {
							expect(applicationService.fetchApplicationsInfo).toHaveBeenNthCalledWith(index, 'rootUrl', [
								{
									applicationID: applicationId,
									childApplicationID: 0
								}
							]);
						}
					);

					it('should store data in localStorage twice', () => {
						expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
					});

					it('should call localStorage with "1" as applicationID', () => {
						expect(window.localStorage.setItem).toHaveBeenNthCalledWith(
							1,
							'ObliqueHeaderWidgetApplications',
							'{"1":{"applicationID":1,"image":"imageBase64_1","lastModificationDate":"timestamp_1","name":{"en":"EN_1","de":"DE_1","fr":"FR_1","it":"IT_1"},"url":"appUrl_1"}}'
						);
					});

					it('should call localStorage with "1" and "2" as applicationID', () => {
						expect(window.localStorage.setItem).toHaveBeenNthCalledWith(
							2,
							'ObliqueHeaderWidgetApplications',
							'{"1":{"applicationID":1,"image":"imageBase64_1","lastModificationDate":"timestamp_1","name":{"en":"EN_1","de":"DE_1","fr":"FR_1","it":"IT_1"},"url":"appUrl_1"},"2":{"applicationID":2,"image":"imageBase64_2","lastModificationDate":"timestamp_2","name":{"en":"EN_2","de":"DE_2","fr":"FR_2","it":"IT_2"},"url":"appUrl_2"}}'
						);
					});

					it.each([0, 1])('should return mockData for the %sth result', index => {
						expect(results[index]).toEqual([mockData[index]]);
					});
				});

				describe('two runs with partial different inputs', () => {
					const mockData = buildMockData(1, 2);
					const results: ObIServiceNavigationApplicationInfo[][] = [];
					beforeEach(done => {
						jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of([mockData[0]]));
						service
							.fetchApplicationsInfo('rootUrl', [
								{
									applicationID: 1,
									childApplicationID: 0
								}
							])
							.subscribe(data => {
								results.push(data);
								done();
							});
					});

					beforeEach(done => {
						jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
						service
							.fetchApplicationsInfo('rootUrl', [
								{
									applicationID: 1,
									childApplicationID: 0
								},
								{
									applicationID: 2,
									childApplicationID: 0
								}
							])
							.subscribe(data => {
								results.push(data);
								done();
							});
					});

					it('should call ObServiceNavigationApplicationsService.fetchApplicationsInfo twice', () => {
						expect(applicationService.fetchApplicationsInfo).toHaveBeenCalledTimes(2);
					});

					it.each([
						{index: 1, applicationId: 1},
						{index: 2, applicationId: 2}
					])(
						'should call ObServiceNavigationApplicationsService.fetchApplicationsInfo with "$applicationId" as applicationID',
						({index, applicationId}) => {
							expect(applicationService.fetchApplicationsInfo).toHaveBeenNthCalledWith(index, 'rootUrl', [
								{
									applicationID: applicationId,
									childApplicationID: 0
								}
							]);
						}
					);

					it('should store data in localStorage twice', () => {
						expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
					});

					it('should call localStorage with "1" as applicationID', () => {
						expect(window.localStorage.setItem).toHaveBeenNthCalledWith(
							1,
							'ObliqueHeaderWidgetApplications',
							'{"1":{"applicationID":1,"image":"imageBase64_1","lastModificationDate":"timestamp_1","name":{"en":"EN_1","de":"DE_1","fr":"FR_1","it":"IT_1"},"url":"appUrl_1"}}'
						);
					});

					it('should call localStorage with "1" and "2" as applicationID', () => {
						expect(window.localStorage.setItem).toHaveBeenNthCalledWith(
							2,
							'ObliqueHeaderWidgetApplications',
							'{"1":{"applicationID":1,"image":"imageBase64_1","lastModificationDate":"timestamp_1","name":{"en":"EN_1","de":"DE_1","fr":"FR_1","it":"IT_1"},"url":"appUrl_1"},"2":{"applicationID":2,"image":"imageBase64_2","lastModificationDate":"timestamp_2","name":{"en":"EN_2","de":"DE_2","fr":"FR_2","it":"IT_2"},"url":"appUrl_2"}}'
						);
					});

					it('should return mockData for the first result', () => {
						expect(results[0]).toEqual([mockData[0]]);
					});

					it('should return mockData for the second result', () => {
						expect(results[1]).toEqual(mockData);
					});
				});
			});
		});

		describe('with non empty localStorage', () => {
			beforeEach(() => {
				TestBed.overrideProvider(WINDOW, {useValue: window});
				jest.spyOn(window.localStorage, 'getItem').mockReturnValue(
					JSON.stringify({
						1: {
							applicationID: 1,
							image: 'imageBase64_1',
							lastModificationDate: 'timestamp_1',
							name: {en: 'EN_1', de: 'DE_1', fr: 'FR_1', it: 'IT_1'},
							url: 'appUrl_1'
						}
					})
				);
				service = TestBed.inject(ObServiceNavigationApplicationsStoreService);
				applicationService = TestBed.inject(ObServiceNavigationApplicationsApiService);
			});

			it('should be created', () => {
				expect(service).toBeTruthy();
			});

			it('should load data from localStorage', () => {
				expect(window.localStorage.getItem).toHaveBeenCalledWith('ObliqueHeaderWidgetApplications');
			});

			describe('fetchApplicationsInfo', () => {
				describe('one run', () => {
					let result: ObIServiceNavigationApplicationInfo[];
					const mockData = buildMockData(1);
					beforeEach(done => {
						jest.spyOn(applicationService, 'fetchApplicationsInfo').mockReturnValue(of(mockData));
						service
							.fetchApplicationsInfo('rootUrl', [
								{
									applicationID: 1,
									childApplicationID: 0
								}
							])
							.subscribe(data => {
								result = data;
								done();
							});
					});

					it('should not call ObServiceNavigationApplicationsService.fetchApplicationsInfo', () => {
						expect(applicationService.fetchApplicationsInfo).not.toHaveBeenCalled();
					});

					it('should not store data in localStorage once', () => {
						expect(window.localStorage.setItem).not.toHaveBeenCalled();
					});

					it('should return mockData', () => {
						expect(result).toEqual(mockData);
					});
				});
			});
		});
	});

	function buildMockData(...ids): ObIServiceNavigationApplicationInfo[] {
		return ids.map((info, index: number) => {
			const numeral = index + 1;
			return {
				applicationID: numeral,
				image: `imageBase64_${numeral}`,
				lastModificationDate: `timestamp_${numeral}`,
				name: {en: `EN_${numeral}`, de: `DE_${numeral}`, fr: `FR_${numeral}`, it: `IT_${numeral}`},
				url: `appUrl_${numeral}`
			};
		});
	}
});
