import type {Category} from '../../cms/models/category.model';
import type {Accordion, Link} from '../accordion-links/accordion-links.model';
import type {CMSPage} from '../../cms/models/cms-page.model';

export function mapCMSPageShortToAccordion(data: CMSPage[], category: Category): Accordion {
	return {
		id: `${category.id}`,
		links: mapToLink(data.filter(entry => entry.category === category.id)),
		title: category.name.toLowerCase(),
	};
}

function mapToLink(data: CMSPage[]): Link[] {
	return data.map(
		(value: CMSPage) =>
			({
				id: value.id,
				minVersion: value.min_version,
				maxVersion: value.max_version,
				slug: value.slug,
				title: value.name,
			}) as Link
	);
}
