/* eslint-disable @typescript-eslint/member-ordering */
import {inject} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {toSignal} from '@angular/core/rxjs-interop';

export class MasterLayoutComponentBase {
	protected readonly masterLayout = inject(ObMasterLayoutService);
	home: string;

	hasCover = toSignal(
		this.masterLayout.layout.configEvents$.pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_COVER),
			map((evt: ObIMasterLayoutEvent) => !!evt.value)
		),
		{initialValue: this.masterLayout.layout.hasCover}
	);
	hasLayout = toSignal(
		this.masterLayout.layout.configEvents$.pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_DEFAULT_LAYOUT),
			map((evt: ObIMasterLayoutEvent) => !!evt.value)
		),
		{initialValue: this.masterLayout.layout.hasLayout}
	);
	hasMaxWidth = toSignal(
		this.masterLayout.layout.configEvents$.pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAX_WIDTH),
			map((evt: ObIMasterLayoutEvent) => !!evt.value)
		),
		{initialValue: this.masterLayout.layout.hasMaxWidth}
	);
	isMenuOpened = toSignal(
		this.masterLayout.layout.configEvents$.pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.IS_MENU_OPENED),
			map((evt: ObIMasterLayoutEvent) => !!evt.value)
		),
		{initialValue: this.masterLayout.layout.isMenuOpened}
	);
	noNavigation = toSignal(
		this.masterLayout.layout.configEvents$.pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION),
			map((evt: ObIMasterLayoutEvent) => !evt.value)
		),
		{initialValue: !this.masterLayout.layout.hasMainNavigation}
	);
	hasOffCanvas = toSignal(
		this.masterLayout.layout.configEvents$.pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_OFF_CANVAS),
			map((evt: ObIMasterLayoutEvent) => !!evt.value)
		),
		{initialValue: this.masterLayout.layout.hasOffCanvas}
	);
	isHeaderSticky = toSignal(
		this.masterLayout.header.configEvents$.pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_STICKY),
			map((evt: ObIMasterLayoutEvent) => !!evt.value)
		),
		{initialValue: this.masterLayout.header.isSticky}
	);
	isFooterSticky = toSignal(
		this.masterLayout.footer.configEvents$.pipe(
			filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.FOOTER_IS_STICKY),
			map((evt: ObIMasterLayoutEvent) => !!evt.value)
		),
		{initialValue: this.masterLayout.footer.isSticky}
	);

	protected readonly unsubscribe = new Subject<void>();

	private readonly config = inject(ObMasterLayoutConfig);

	constructor() {
		this.home = this.config.homePageRoute;
	}
}
