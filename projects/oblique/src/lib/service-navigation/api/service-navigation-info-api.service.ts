import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, map, tap} from 'rxjs';
import {
	ObISeriviceNavigationHelpResponse,
	ObIServiceNavigationBackendInfo,
	ObIServiceNavigationResponse
} from './service-navigation.api.model';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationInfoApiService {
	private readonly httpClient = inject(HttpClient);

	get(rootUrl: string, appId: string, language: string): Observable<ObIServiceNavigationBackendInfo> {
		const url = `${rootUrl}api/applications/${appId}/helpinformation`;

		return this.httpClient
			.get<ObIServiceNavigationResponse<ObISeriviceNavigationHelpResponse>>(url, {params: {lang: language}, withCredentials: true})
			.pipe(
				tap(info => this.errorManagement(info, url)),
				map(info => this.formatData(info))
			);
	}

	private errorManagement(info: ObIServiceNavigationResponse<ObISeriviceNavigationHelpResponse>, url: string): void {
		if (info.errorCode) {
			throw new Error(`Url ${url} failed.\nError code: ${info.errorCode}.\nError message: ${info.message}.`);
		}
	}

	private formatData(info: ObIServiceNavigationResponse<ObISeriviceNavigationHelpResponse>): ObIServiceNavigationBackendInfo {
		return {
			description: info.data.title.optionalInformation,
			helpText: info.data.help.optionalInformation,
			links: info.data.help.links.map(link => ({url: link.link, label: link.title})),
			contactText: info.data.contact.optionalInformation,
			contact: {
				email: info.data.contact.email.emailAddress,
				phone: info.data.contact.phone.phoneNumber,
				formUrl: info.data.contact.links[0]?.link ?? undefined
			}
		};
	}
}
