import {SimpleChange, SimpleChanges} from '@angular/core';

export interface Accordion {
	id: string;
	links: Link[];
	title: string;
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
