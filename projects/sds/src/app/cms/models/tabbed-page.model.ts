// This is due to the CMS naming convention.
/* eslint-disable @typescript-eslint/naming-convention */
import {Type} from '@angular/core';
import {CodeExamples} from '../../code-examples/code-examples.model';

export interface TabbedPageCompleteCms {
	data: TabbedPageComplete;
}

export interface TabbedPageComplete {
	id: number;
	name: string;
	slug: string;
	category: number;
	api: string;
	ui_ux: string;
	min_version: number;
	max_version: number;
}

export interface CmsData {
	title: string;
	api: string;
	uiUx: string;
	source: Type<CodeExamples> | undefined;
	tab: string;
}
