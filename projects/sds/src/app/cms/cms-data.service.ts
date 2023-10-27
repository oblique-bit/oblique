import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CategoryCms} from './models/category.model';
import {TabbedPageCompleteCms} from './models/tabbed-page.model';
import {DocumentationPageCompleteCms} from './models/documentation-page.model';
import {VersionCms} from './models/version.model';
import {CMSPageShortList} from './models/cms-page.model';

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

	getDocumentationPagesShort(): Observable<CMSPageShortList> {
		return this.httpClient.get<CMSPageShortList>(`${this.baseUrl}items/Documentation?fields=id,name,slug,category,min_version,max_version`);
	}

	getDocumentationPagesComplete(id: number): Observable<DocumentationPageCompleteCms> {
		return this.httpClient.get<DocumentationPageCompleteCms>(`${this.baseUrl}items/Documentation/${id}`);
	}

	getTabbedPageComplete(id: number): Observable<TabbedPageCompleteCms> {
		return this.httpClient.get<TabbedPageCompleteCms>(`${this.baseUrl}items/TabbedPage/${id}`);
	}

	getTabbedPagesShort(): Observable<CMSPageShortList> {
		return this.httpClient.get<CMSPageShortList>(`${this.baseUrl}items/TabbedPage?fields=id,name,slug,category,min_version,max_version`);
	}
}
