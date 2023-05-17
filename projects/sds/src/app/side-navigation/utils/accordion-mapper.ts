import {Category} from '../../cms/models/category.model';
import {ComponentPageShort, ComponentPageShortCms} from '../../cms/models/component-page.model';
import {DocumentationPageShort, DocumentationPageShortCms} from '../../cms/models/documentation-page.model';
import {Accordion, Link} from '../accordion-links/accordion-links.model';

export class AccordionMapper {
	static mapDocumentationPageShortToAccordion(data: DocumentationPageShortCms, category: Category): Accordion {
		return {
			id: `${category.id}`,
			links: AccordionMapper.mapToLink(data.data.filter(entry => entry.category === category.id)),
			title: category.name.toLowerCase()
		};
	}

	static mapComponentPageShortToAccordion(data: ComponentPageShortCms): Accordion {
		return {
			id: 'component',
			links: AccordionMapper.mapToLink(data.data),
			title: 'components'
		};
	}

	private static mapToLink(data: ComponentPageShort[] | DocumentationPageShort[]): Link[] {
		return data.map(
			(value: ComponentPageShort | DocumentationPageShort) =>
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
