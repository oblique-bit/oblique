import {Pipe, PipeTransform} from '@angular/core';
import {ObISectionLink, ObIServiceNavigationContact} from '../service-navigation.model';

@Pipe({
	name: 'obContactToLinks',
	standalone: false,
})
export class ObContactToLinksPipe implements PipeTransform {
	transform(values?: ObIServiceNavigationContact): ObISectionLink[] {
		return [this.getPhone(values), this.getMail(values), this.getContact(values)].filter(Boolean);
	}

	private getMail(value: ObIServiceNavigationContact | undefined): ObISectionLink | undefined {
		if (!value?.email) {
			return undefined;
		}

		return {
			url: `mailto:${value.email}`,
			label: value.email,
			isInternalLink: true,
			icon: 'mail',
			extraText: value.emailText,
		};
	}

	private getPhone(value: ObIServiceNavigationContact | undefined): ObISectionLink | undefined {
		if (!value?.phone) {
			return undefined;
		}

		return {
			url: `tel:${value.phone}`,
			label: value.phone,
			isInternalLink: true,
			icon: 'phone',
			ariaLabel: {
				text: 'i18n.oblique.service-navigation.section.phone.aria-label',
				parameters: {
					phoneNumber: value.phone
						.split('')
						.filter(character => character !== ' ')
						.join(', '),
				},
			},
			extraText: value.phoneText,
		};
	}

	private getContact(value: ObIServiceNavigationContact | undefined): ObISectionLink | undefined {
		if (!value?.formUrl) {
			return undefined;
		}

		return {
			url: value.formUrl,
			label: 'i18n.oblique.service-navigation.info.contact.form',
			isInternalLink: false,
			extraText: value.formUrlText,
		};
	}
}
