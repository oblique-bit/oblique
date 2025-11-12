import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import type {Observable} from 'rxjs';
import type {CategoryCms} from './models/category.model';
import type {TabbedPageCompleteCms} from './models/tabbed-page.model';
import type {TextPageCompleteCms} from './models/text-page.model';
import type {VersionCms} from './models/version.model';
import type {CMSPageShortList} from './models/cms-page.model';
import type {BannerCms} from './models/banner.model';

@Injectable({
	providedIn: 'root',
})
export class CmsDataService {
	readonly baseUrl = 'https://oblique.directus.app/';
	private readonly httpClient = inject(HttpClient);

	getVersions(): Observable<VersionCms> {
		return this.httpClient.get<VersionCms>(`${this.baseUrl}items/Version`);
	}

	getCategories(): Observable<CategoryCms> {
		return this.httpClient.get<CategoryCms>(`${this.baseUrl}items/Category?sort=order`);
	}

	getTextPagesShort(): Observable<CMSPageShortList> {
		return this.httpClient.get<CMSPageShortList>(
			`${this.baseUrl}items/TextPage?fields=id,name,slug,category,min_version,max_version&sort=order,name`
		);
	}

	getTextPagesComplete(id: number): Observable<TextPageCompleteCms> {
		return this.httpClient.get<TextPageCompleteCms>(`${this.baseUrl}items/TextPage/${id}`);
	}

	getTabbedPageComplete(id: number): Observable<TabbedPageCompleteCms> {
		return this.httpClient.get<TabbedPageCompleteCms>(`${this.baseUrl}items/TabbedPage/${id}/?fields=*.*`);
	}

	getTabbedPagesShort(): Observable<CMSPageShortList> {
		return this.httpClient.get<CMSPageShortList>(
			`${this.baseUrl}items/TabbedPage?fields=id,name,slug,category,min_version,max_version&sort=order,name`
		);
	}

	getBanner(): Observable<BannerCms> {
		return this.httpClient.get<BannerCms>(`${this.baseUrl}items/Banner`);
	}
}
