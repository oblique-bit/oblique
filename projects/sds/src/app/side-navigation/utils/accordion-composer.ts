import {CategoryCms} from '../../cms/models/category.model';
import {CMSPage, CMSPageShortList} from '../../cms/models/cms-page.model';
import {Accordion} from '../accordion-links/accordion-links.model';
import {AccordionMapper} from './accordion-mapper';

export class AccordionComposer {
	static composeAccordions(value: {
		categories: CategoryCms;
		tabbedPages: CMSPageShortList;
		documentationPages: CMSPageShortList;
	}): Accordion[] {
		const accordions: Accordion[] = [];

		const allPages: CMSPage[] = [...value.tabbedPages.data, ...value.documentationPages.data];

		value.categories.data
			.sort((c1, c2) => c2.name.localeCompare(c1.name)) // This is a small hack to have the categories Introductions & Guidelines in the correct order. This maight not scale if other categories are added. This must be deleted when the sorting will done through the CMS.
			.forEach(category => accordions.push(AccordionMapper.mapCMSPageShortToAccordion(allPages, category)));

		return accordions;
	}
}
