import {CategoryCms} from '../../cms/models/category.model';
import {CMSPage, CMSPageShortList} from '../../cms/models/cms-page.model';
import {Accordion} from '../accordion-links/accordion-links.model';
import {mapCMSPageShortToAccordion} from './accordion-mapper';

export function composeAccordions(value: {
	categories: CategoryCms;
	tabbedPages: CMSPageShortList;
	textPages: CMSPageShortList;
}): Accordion[] {
	const accordions: Accordion[] = [];

	const allPages: CMSPage[] = [...value.tabbedPages.data, ...value.textPages.data];

	value.categories.data.forEach(category => accordions.push(mapCMSPageShortToAccordion(allPages, category)));

	return accordions;
}
