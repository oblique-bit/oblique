import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {NewsletterTokenComplete} from './newsletter-token.model';

@Injectable({
	providedIn: 'root'
})
export class NewsletterService {
	readonly baseUrl = 'https://oblique.directus.app/';

	private bearerToken: string;

	public get token(): string {
		return this.bearerToken;
	}

	public set token(newToken: string) {
		this.bearerToken = newToken;
	}

	private readonly httpClient = inject(HttpClient);

	getNewsletterToken(): Observable<NewsletterTokenComplete> {
		return this.httpClient.get<NewsletterTokenComplete>(`${this.baseUrl}items/newsletter_token/1`);
	}

	addNewsletterEntry(email: string): Observable<string> {
		const header = this.createHeaderWithBearerToken(this.bearerToken);
		return this.httpClient.post<string>(`${this.baseUrl}items/newsletter`, {email}, {headers: header});
	}

	createHeaderWithBearerToken(token: string): HttpHeaders {
		return new HttpHeaders({Authorization: `Bearer ${token}`}); // eslint-disable-line @typescript-eslint/naming-convention
	}
}
