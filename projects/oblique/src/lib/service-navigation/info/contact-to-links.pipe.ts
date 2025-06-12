import {Pipe, PipeTransform} from '@angular/core';
import {ObISectionLink, ObIServiceNavigationContact} from '../service-navigation.model';

@Pipe({
	name: 'obContactToLinks',
	standalone: false
})
export class ObContactToLinksPipe implements PipeTransform {
	transform(values?: ObIServiceNavigationContact): ObISectionLink[] {
		return [this.getMail(values?.email), this.getTel(values?.tel), this.getContact(values?.formUrl)].filter(Boolean);
	}

	private getMail(value: string | undefined): ObISectionLink | undefined {
		if (value === undefined) {
			return undefined;
		}

		return {
			url: `mailto:${value}`,
			label: value,
			isInternalLink: true
		};
	}

	private getTel(value: string | undefined): ObISectionLink | undefined {
		if (value === undefined) {
			return undefined;
		}

		return {
			url: `tel:${value}`,
			label: value,
			isInternalLink: true,
			ariaLabel: {
				text: 'i18n.oblique.service-navigation.section.tel.aria-label',
				parameters: {
					phoneNumber: value
						.split('')
						.filter(character => character !== ' ')
						.join(', ')
				}
			}
		};
	}

	private getContact(value: string | undefined): ObISectionLink | undefined {
		if (value === undefined) {
			return undefined;
		}

		return {
			url: value,
			label: 'i18n.oblique.service-navigation.info.contact.form',
			isInternalLink: false
		};
	}
}
