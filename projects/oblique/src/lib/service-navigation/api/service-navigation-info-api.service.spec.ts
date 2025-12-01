import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import {ObServiceNavigationInfoApiService} from './service-navigation-info-api.service';
import {
	ObISeriviceNavigationHelpResponse,
	ObIServiceNavigationBackendInfo,
	ObIServiceNavigationResponse,
} from './service-navigation.api.model';

describe('ObServiceNavigationInfoApiService', () => {
	let service: ObServiceNavigationInfoApiService;
	let httpClient: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObServiceNavigationInfoApiService, provideHttpClient()],
		});
		httpClient = TestBed.inject(HttpClient);
		service = TestBed.inject(ObServiceNavigationInfoApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('get', () => {
		it('should return an Observable', () => {
			expect(service.get('', '', '') instanceof Observable).toBe(true);
		});

		describe('request', () => {
			it('should have the "lang" and "withCredential" properties', () => {
				jest.spyOn(httpClient, 'get').mockReturnValue(of(fixtureApplicationHelp()));
				service.get('rootUrl/', '42', 'en');

				expect(httpClient.get).toHaveBeenCalledWith('rootUrl/api/applications/42/helpinformation', {
					params: {lang: 'en'},
					withCredentials: true,
				});
			});
		});

		describe('response', () => {
			describe('with regular data', () => {
				let result: ObIServiceNavigationBackendInfo;
				beforeEach(() => {
					jest.spyOn(httpClient, 'get').mockReturnValue(of(fixtureApplicationHelp()));
					service.get('', '', '').subscribe(infoBackend => (result = infoBackend));
				});

				it('should have a "description" property with the title optional information', () => {
					expect(result.description).toBe(fixtureApplicationHelp().data.title.optionalInformation);
				});

				it('should have a "helpText" property with the help optional information', () => {
					expect(result.helpText).toBe(fixtureApplicationHelp().data.help.optionalInformation);
				});

				it('should have a "contactText" property with the contact optional information', () => {
					expect(result.contactText).toBe(fixtureApplicationHelp().data.contact.optionalInformation);
				});

				it('should have a "links" property with an object containing url and label', () => {
					expect(result.links).toEqual([{label: 'link1', url: 'https://example.com/1'}]);
				});

				it('should have a "contact.email" property with the email address', () => {
					expect(result.contact.email).toEqual(fixtureApplicationHelp().data.contact.email.emailAddress);
				});

				it('should have a "contact.emailText" property with email optionalInformation', () => {
					expect(result.contact.emailText).toEqual(fixtureApplicationHelp().data.contact.email.optionalInformation);
				});

				it('should have a "contact.phone" property with the phone number', () => {
					expect(result.contact.phone).toEqual(fixtureApplicationHelp().data.contact.phone.phoneNumber);
				});

				it('should have a "contact.phoneText" property with tel optionalInformation', () => {
					expect(result.contact.phoneText).toEqual(fixtureApplicationHelp().data.contact.phone.optionalInformation);
				});

				it('should have a "contact.formUrl" property with the first contact link', () => {
					expect(result.contact.formUrl).toEqual(fixtureApplicationHelp().data.contact.links[0].link);
				});

				it('should have a "contact.formUrlText" property with links[0] optionalInformation', () => {
					expect(result.contact.formUrlText).toEqual(
						fixtureApplicationHelp().data.contact.links[0].optionalInformation
					);
				});
			});

			describe('without links', () => {
				it('should not have a contact form', () => {
					const fixture = fixtureApplicationHelp();
					fixture.data.contact.links = [];
					jest.spyOn(httpClient, 'get').mockReturnValue(of(fixture));
					let result: ObIServiceNavigationBackendInfo;
					service.get('', '', '').subscribe(infoBackend => (result = infoBackend));

					expect(result.contact.formUrl).toEqual(undefined);
				});
			});

			describe('with a backend error', () => {
				const fakeErrorCode = 1;
				const fakeErrorMessage = 'fake error message';
				const fakeAppId = 'fakeAppId';
				const fakeRootUrl = 'http://rootUrl/';
				let error: Error;

				beforeEach(() => {
					jest.spyOn(httpClient, 'get').mockReturnValue(
						of({
							errorCode: fakeErrorCode,
							message: fakeErrorMessage,
							data: {},
						} as ObIServiceNavigationResponse<ObISeriviceNavigationHelpResponse>)
					);
					service.get(fakeRootUrl, fakeAppId, '').subscribe({
						error: (err: Error) => {
							error = err;
						},
					});
				});

				it('should receive an Error', () => {
					expect(error instanceof Error).toBe(true);
				});

				describe('error message', () => {
					let errorMessages: string[];
					beforeEach(() => {
						errorMessages = error.message.split('\n');
					});

					it('should contain the url', () => {
						expect(errorMessages[0]).toContain(
							`Url ${fakeRootUrl}api/applications/${fakeAppId}/helpinformation failed.`
						);
					});

					it('should contain the error code', () => {
						expect(errorMessages[1]).toContain(`Error code: ${fakeErrorCode}.`);
					});

					it('should contain the error message', () => {
						expect(errorMessages[2]).toContain(`Error message: ${fakeErrorMessage}.`);
					});
				});
			});
		});
	});
});

function fixtureApplicationHelp(): ObIServiceNavigationResponse<ObISeriviceNavigationHelpResponse> {
	return {
		data: {
			title: {
				application: {
					applicationName: '',
					applicationDescription: '',
				},
				tenant: {
					tenantName: '',
					tenantAbbreviation: '',
				},
				optionalInformation: 'random description',
			},
			help: {
				links: [
					{
						title: 'link1',
						link: 'https://example.com/1',
						optionalInformation: '',
					},
				],
				optionalInformation: 'help text',
			},
			contact: {
				links: [
					{
						title: '',
						link: 'https://example.com/contact',
						optionalInformation: 'form url text',
					},
				],
				email: {
					emailAddress: 'example@example.com',
					optionalInformation: 'email text',
				},
				phone: {
					phoneNumber: '+411234567',
					optionalInformation: 'tel text',
				},
				optionalInformation: 'contact text',
			},
		},
		statusCode: 200,
		success: true,
	};
}
