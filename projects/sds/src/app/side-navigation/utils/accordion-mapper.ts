import {Category} from '../../cms/models/category.model';
import {Accordion, Link} from '../accordion-links/accordion-links.model';
import {CMSPage, CMSPageShortList} from '../../cms/models/cms-page.model';

export class AccordionMapper {
	static mapCMSPageShortToAccordion(data: CMSPageShortList, category: Category): Accordion {
		return {
			id: `${category.id}`,
			links: AccordionMapper.mapToLink(data.data.filter(entry => entry.category === category.id)),
			title: category.name.toLowerCase()
		};
	}

	static mapTabbedPageShortToAccordion(data: CMSPageShortList): Accordion {
		return {
			id: 'component',
			links: AccordionMapper.mapToLink(data.data),
			title: 'components'
		};
	}

	private static mapToLink(data: CMSPage[]): Link[] {
		return data.map(
			(value: CMSPage) =>
				({
					id: value.id,
					minVersion: value.min_version,
					maxVersion: value.max_version,
					slug: value.slug,
					title: value.name
				} as Link)
		);
	}
}
