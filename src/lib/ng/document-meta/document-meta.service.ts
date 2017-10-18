import {Injectable, Inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';

/**
 * DocumentMetaService - Service for updating document metadata
 *
 * Inspired & adapted from: https://gist.github.com/LA1CH3/718588765d56a8932de52c64c3561dcf
 */
@Injectable()
export class DocumentMetaService {

	public titleSeparator = ' · ';
	public titleSuffix = '';
	public description = '';

	private headElement: HTMLElement;
	private metaDescription: HTMLElement;
	private currentMetaInformation = {
		title: '',
		description: ''
	};

	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private titleService: Title,
				private translate: TranslateService,
				@Inject(DOCUMENT) private document: any) {

		this.headElement = this.document.querySelector('head');
		this.metaDescription = this.getOrCreateMetaElement('description');
		this.translate.onLangChange.subscribe(this.updateMetaInformation.bind(this));

		// Subscribe to NavigationEnd events and handle current activated route:
		router.events
			.filter(event => event instanceof NavigationEnd)
			.map(() => this.activatedRoute)
			.map(route => {
				while (route.firstChild) {
					route = route.firstChild;
				}
				return route;
			})
			.filter(route => route.outlet === 'primary')
			.mergeMap(route => route.data)
			.subscribe((data) => {
				this.currentMetaInformation.title = data.title;
				this.currentMetaInformation.description = data.description || this.description;
				this.updateMetaInformation();
			});
	}

	/**
	 * Updates the document page title.
	 *
	 * @see Title
	 * @param title the string prefix, which may be translated
	 * @param separator the string separator between the title prefix and the suffix
	 * @param suffix the string to be appended at the end
	 */
	public setTitle(title: string, separator: string = this.titleSeparator, suffix: string = this.titleSuffix) {
		if (title && title !== '') {
			this.translate.get([title, suffix]).subscribe(translation => {
				this.titleService.setTitle(`${translation[title]}${separator}${translation[suffix]}`);
			});
		} else {
			this.titleService.setTitle(this.translate.instant(suffix));
		}
	}

	/**
	 * Gets the document page description.
	 */
	public getMetaDescription(): string {
		return this.metaDescription.getAttribute('content');
	}

	/**
	 * Updates the document page description.
	 *
	 * @param description the description key, which may be translated
	 */
	public setDescription(description: string) {
		if (description && description !== '') {
			this.translate.get(description).subscribe(translation => {
				this.metaDescription.setAttribute('content', translation);
			});
		} else {
			this.metaDescription.setAttribute('content', '');
		}
	}

	/**
	 * Gets the meta HTML Element when it is in the markup, or creates it.
	 *
	 * @param name
	 * @returns {HTMLMetaElement}
	 */
	private getOrCreateMetaElement(name: string): HTMLMetaElement {
		let meta: HTMLMetaElement = this.headElement.querySelector('meta[name=' + name + ']') as HTMLMetaElement;
		if (meta === null) {
			meta = this.document.createElement('meta');
			meta.setAttribute('name', name);
			this.headElement.appendChild(meta);
		}
		return meta;
	}

	/**
	 * Updates the document page title and description
	 */
	private updateMetaInformation() {
		this.setTitle(this.currentMetaInformation.title);
		this.setDescription(this.currentMetaInformation.description);
	}
}
