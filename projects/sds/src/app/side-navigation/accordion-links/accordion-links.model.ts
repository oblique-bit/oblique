import type {SimpleChange, SimpleChanges} from '@angular/core';

export interface Accordion {
	id: string;
	links: Link[];
	title: string;
	minVersion: number;
	maxVersion?: number;
}

export interface Link {
	id: number;
	minVersion: number;
	maxVersion?: number;
	slug: string;
	title: string;
}

export interface AccordionLinksChanges extends SimpleChanges {
	accordions: SimpleChange;
}
