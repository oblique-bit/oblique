import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CategoryCms} from './models/category.model';
import {TabbedPageCompleteCms, TabbedPageShortCms} from './models/component-page.model';
import {DocumentationPageCompleteCms, DocumentationPageShortCms} from './models/documentation-page.model';
import {VersionCms} from './models/version.model';

@Injectable({
	providedIn: 'root'
})
export class CmsDataService {
	readonly baseUrl = 'https://ob-directus.azurewebsites.net/';

	constructor(private readonly httpClient: HttpClient) {}

	getVersions(): Observable<VersionCms> {
		return this.httpClient.get<VersionCms>(`${this.baseUrl}items/Version`);
	}

	getCategories(): Observable<CategoryCms> {
		return this.httpClient.get<CategoryCms>(`${this.baseUrl}items/Category`);
	}

	getDocumentationPagesShort(): Observable<DocumentationPageShortCms> {
		return this.httpClient.get<DocumentationPageShortCms>(
			`${this.baseUrl}items/Documentation?fields=id,name,slug,category,min_version,max_version`
		);
	}

	getDocumentationPagesComplete(id: number): Observable<DocumentationPageCompleteCms> {
		return this.httpClient.get<DocumentationPageCompleteCms>(`${this.baseUrl}items/Documentation/${id}`);
	}

	getTabbedPageComplete(id: number): Observable<TabbedPageCompleteCms> {
		return this.httpClient.get<TabbedPageCompleteCms>(`${this.baseUrl}items/Component/${id}`);
	}

	getTabbedPagesShort(): Observable<TabbedPageShortCms> {
		return this.httpClient.get<TabbedPageShortCms>(`${this.baseUrl}items/Component?fields=id,name,slug,min_version,max_version`);
	}
}
