import {Pipe, PipeTransform} from '@angular/core';
import {ObISectionLink, ObIServiceNavigationContact} from '../service-navigation.model';

@Pipe({
	name: 'obContactToLinks'
})
export class ObContactToLinksPipe implements PipeTransform {
	transform(values?: ObIServiceNavigationContact): ObISectionLink[] {
		return Object.keys(values ?? {})
			.filter(key => !!values[key])
			.reduce<{type: string; value: string}[]>(
				(links, key) => [
					...links,
					{
						type: key,
						value: values[key]
					}
				],
				[]
			)
			.map(link => ({
				url: this.buildUrl(link),
				label: link.value,
				isInternalLink: true,
				ariaLabel: this.buildTelAriaLabel(link)
			}));
	}

	private buildUrl(link: {type: string; value: string}): string {
		const prefix = link.type === 'email' ? 'mailto' : 'tel';
		return `${prefix}:${link.value}`;
	}

	private buildTelAriaLabel(link: {type: string; value: string}): {text: string; parameters: Record<string, unknown>} | undefined {
		return link.type === 'tel'
			? {
					text: 'i18n.oblique.service-navigation.section.tel.arial-label',
					parameters: {
						phoneNumber: link.value
							.split('')
							.filter(character => character !== ' ')
							.join(', ')
					}
			  }
			: undefined;
	}
}
