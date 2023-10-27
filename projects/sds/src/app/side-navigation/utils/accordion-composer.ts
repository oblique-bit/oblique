import {CategoryCms} from '../../cms/models/category.model';
import {CMSPageShortList} from '../../cms/models/cms-page.model';
import {Accordion} from '../accordion-links/accordion-links.model';
import {AccordionMapper} from './accordion-mapper';

export class AccordionComposer {
	static composeAccordions(value: {
		categories: CategoryCms;
		componentAccordions: CMSPageShortList;
		documentationAccordions: CMSPageShortList;
	}): Accordion[] {
		const accordions: Accordion[] = [];

		value.categories.data
			.sort((c1, c2) => c2.name.localeCompare(c1.name)) // This is a small hack to have the categories Introductions & Guidelines in the correct order. This maight not scale if other categories are added. This must be deleted when the sorting will done through the CMS.
			.forEach(category => accordions.push(AccordionMapper.mapCMSPageShortToAccordion(value.documentationAccordions, category)));

		accordions.push(AccordionMapper.mapTabbedPageShortToAccordion(value.componentAccordions));

		return accordions;
	}
}
