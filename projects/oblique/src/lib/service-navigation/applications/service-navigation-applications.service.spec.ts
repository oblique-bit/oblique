import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {count, from, of} from 'rxjs';
import {ObServiceNavigationApplicationsApiService} from '../api/service-navigation-applications-api.service';
import {ObServiceNavigationApplicationsService} from './service-navigation-applications.service';

describe('ObServiceNavigationApplicationsService', () => {
	let service: ObServiceNavigationApplicationsService;
	let applicationsService: ObServiceNavigationApplicationsApiService;
	const mockApplications = [
		{
			applicationID: 1,
			image: 'imageBase64',
			lastModificationDate: 'timestamp',
			name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'},
			url: 'appUrl1'
		},
		{
			applicationID: 2,
			image: 'imageBase64',
			lastModificationDate: 'timestamp',
			name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'},
			url: 'appUrl2'
		},
		{
			applicationID: 3,
			image: 'imageBase64',
			lastModificationDate: 'timestamp',
			name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'},
			url: 'appUrl3'
		},
		{
			applicationID: 4,
			image: 'imageBase64',
			lastModificationDate: 'timestamp',
			name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'},
			url: 'appUrl4'
		}
	];

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObServiceNavigationApplicationsService,
				{
					provide: ObServiceNavigationApplicationsApiService,
					useValue: {fetchApplicationsInfo: jest.fn().mockReturnValue(of(mockApplications))}
				}
			]
		});
		service = TestBed.inject(ObServiceNavigationApplicationsService);
		applicationsService = TestBed.inject(ObServiceNavigationApplicationsApiService);
	});

	describe('getApplications', () => {
		describe.each([
			{description: 'no application list', value: null},
			{description: 'an empty application list', value: []}
		])('with $description application as input', ({value}) => {
			it('should not emit', fakeAsync(() => {
				let emitted = false;
				of(value)
					.pipe(service.getApplications('http:/rootUrl/'))
					.subscribe(() => {
						emitted = true;
					});
				tick();
				expect(emitted).toBe(false);
			}));
		});

		describe('with 4 applications as input', () => {
			let result;
			beforeEach(done => {
				of([
					{appID: 1, childAppID: 0, accessOK: true, online: true},
					{appID: 2, childAppID: 0, accessOK: true, online: false},
					{appID: 3, childAppID: 0, accessOK: false, online: false},
					{appID: 4, childAppID: 0, accessOK: false, online: true}
				])
					.pipe(service.getApplications('http:/rootUrl/'))
					.subscribe(received => {
						result = received;
						done();
					});
			});

			it('should call fetchApplicationsInfo with correct parameters', () => {
				expect(applicationsService.fetchApplicationsInfo).toHaveBeenCalledWith('http:/rootUrl/', [
					{applicationID: 1, childApplicationID: 0},
					{applicationID: 2, childApplicationID: 0},
					{applicationID: 3, childApplicationID: 0},
					{applicationID: 4, childApplicationID: 0}
				]);
			});

			it(`should emit an application list with image, name and url`, () => {
				expect(result).toEqual([
					{name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'}, url: 'appUrl1', image: 'imageBase64', status: 'online'},
					{name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'}, url: 'appUrl2', image: 'imageBase64', status: 'offline'},
					{name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'}, url: 'appUrl3', image: 'imageBase64', status: 'offline'},
					{name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'}, url: 'appUrl4', image: 'imageBase64', status: 'inaccessible'}
				]);
			});
		});

		describe('with multiple emissions', () => {
			it('should emit 4 times', done => {
				from([
					[{appID: 1, childAppID: 0, online: true}],
					[{appID: 1, childAppID: 0, online: true}],
					[{appID: 2, childAppID: 0, online: true}],
					[
						{appID: 1, childAppID: 0, online: true},
						{appID: 2, childAppID: 0, online: true}
					],
					[{appID: 2, childAppID: 0, online: true}]
				])
					.pipe(service.getApplications('http:/rootUrl/'), count())
					.subscribe(number => {
						expect(number).toBe(4);
						done();
					});
			});
		});
	});
});
