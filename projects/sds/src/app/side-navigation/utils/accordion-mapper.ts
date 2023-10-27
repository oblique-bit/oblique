import {Category} from '../../cms/models/category.model';
import {Accordion, Link} from '../accordion-links/accordion-links.model';
import {CMSPage} from '../../cms/models/cms-page.model';

export class AccordionMapper {
	static mapCMSPageShortToAccordion(data: CMSPage[], category: Category): Accordion {
		return {
			id: `${category.id}`,
			links: AccordionMapper.mapToLink(data.filter(entry => entry.category === category.id)),
			title: category.name.toLowerCase()
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
