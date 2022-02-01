import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';

@Injectable({
	providedIn: 'root'
})
export class ObMasterLayoutComponentService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	private readonly events = new Subject<ObIMasterLayoutEvent>();
	private isMenuOpenedInternal = false;
	private hasCoverInternal = this.config.layout.hasCover;
	private hasOffCanvasInternal = this.config.layout.hasOffCanvas;
	private hasMainNavigationInternal = this.config.layout.hasMainNavigation;
	private hasLayoutInternal = this.config.layout.hasLayout;
	private hasMaxWidthInternal = this.config.layout.hasMaxWidth;

	constructor(private readonly config: ObMasterLayoutConfig) {
		this.configEvents$ = this.events.asObservable();
	}

	get isMenuOpened(): boolean {
		return this.isMenuOpenedInternal;
	}

	set isMenuOpened(value: boolean) {
		this.isMenuOpenedInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.IS_MENU_OPENED,
			value
		});
	}

	get hasCover(): boolean {
		return this.hasCoverInternal;
	}

	set hasCover(value: boolean) {
		this.hasCoverInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_COVER,
			value
		});
	}

	get hasOffCanvas(): boolean {
		return this.hasOffCanvasInternal;
	}

	set hasOffCanvas(value: boolean) {
		this.hasOffCanvasInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_OFF_CANVAS,
			value
		});
	}

	get hasMainNavigation(): boolean {
		return this.hasMainNavigationInternal;
	}

	set hasMainNavigation(value: boolean) {
		this.hasMainNavigationInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION,
			value
		});
	}

	get hasLayout(): boolean {
		return this.hasLayoutInternal;
	}

	set hasLayout(value: boolean) {
		this.hasLayoutInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_DEFAULT_LAYOUT,
			value
		});
	}

	get hasMaxWidth(): boolean {
		return this.hasMaxWidthInternal;
	}

	set hasMaxWidth(value: boolean) {
		this.hasMaxWidthInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.LAYOUT_HAS_MAX_WIDTH,
			value
		});
	}
}
