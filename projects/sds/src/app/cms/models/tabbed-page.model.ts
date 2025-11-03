// This is due to the CMS naming convention.
import type {Type} from '@angular/core';
import type {CodeExamples} from '../../code-examples/code-examples.model';

export interface TabbedPageCompleteCms {
	data: TabbedPageComplete;
}

export interface TabbedPageComplete {
	id: number;
	name: string;
	slug: string;
	category: number;
	api: string;
	accessibility: string;
	ui_ux_purpose: string;
	ui_ux_general_rules: UiUxEntry[];
	ui_ux_do: UiUxEntry[];
	ui_ux_do_not: UiUxEntry[];
	ui_ux_design_file_latest: string;
	ui_ux_design_file_previous: string;
	ui_ux_related_links: UiUxEntry[];
	ui_ux_additional_info: string;
	min_version: number;
	max_version: number;
	deprecation: string;
}

export interface CmsData {
	title: string;
	api: string;
	accessibility: string;
	uiUx: UiUxData;
	source: Type<CodeExamples> | undefined;
	tab: string;
	deprecation: string;
}

export interface UiUxData {
	purpose?: string;
	do?: string[];
	doNot?: string[];
	generalRules?: string[];
	designFileLatest?: string;
	designFilePrevious?: string;
	relatedLinks?: string[];
	additionalInfo?: string;
}

export interface UiUxEntry {
	text: string;
	id: number;
}
