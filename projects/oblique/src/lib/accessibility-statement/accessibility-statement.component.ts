import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {ObTranslateParamsPipe} from '../translate-params/translate-params.pipe';
import {ObExternalLinkModule} from '../external-link/external-link.module';
import {ObConformity, ObContactData} from '../utilities.model';
import {OB_ACCESSIBILITY_STATEMENT_CONFIGURATION} from '../utilities';
import {ObDatePipe} from '../language/date.pipe';
import {ObEIcon} from '../icon/icon.model';
import {ObIAccessibilityStatementContactInfo} from './accessibility-statement.model';

@Component({
	selector: 'ob-accessibility-statement',
	imports: [ObExternalLinkModule, TranslateModule, ObTranslateParamsPipe, ObDatePipe, DatePipe, MatIcon],
	templateUrl: './accessibility-statement.component.html',
	styleUrl: './accessibility-statement.component.scss',
})
export class AccessibilityStatementComponent {
	readonly parameters = inject(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION);
	readonly exceptions =
		'exceptions' in this.parameters && this.parameters.exceptions.length > 0 ? this.parameters.exceptions : [];
	readonly statementParameters = {
		applicationName: this.parameters.applicationName,
		conformity: this.getConformity(this.parameters.conformity),
		exceptionText: this.getConformityText(this.exceptions.length > 0),
	};
	readonly contacts = this.parameters.contact.map(contact => this.parseContact(contact));
	// eslint-disable-next-line @typescript-eslint/consistent-return
	private getConformity(conformity: ObConformity): string {
		// eslint-disable-next-line default-case
		switch (conformity) {
			case 'full':
				return 'i18n.oblique.accessibility-statement.statement.full';
			case 'partial':
				return 'i18n.oblique.accessibility-statement.statement.partial';
			case 'none':
				return 'i18n.oblique.accessibility-statement.statement.none';
		}
	}

	private getConformityText(hasExceptions: boolean): string {
		return hasExceptions
			? 'i18n.oblique.accessibility-statement.statement.exception'
			: 'i18n.oblique.accessibility-statement.statement.no-exception';
	}

	private parseContact(contact: ObContactData): ObIAccessibilityStatementContactInfo {
		if (contact.phone) {
			return this.buildPhoneContact(contact.phone, contact.context);
		}
		if (contact.email) {
			return this.buildMailContact(contact.email, contact.context);
		}
		if (contact.url) {
			return this.buildUrlContact(contact.url, contact.context);
		}
		throw new Error(
			'Please provide valid contact information for the accessibility statement. At least one object with a non-empty phone, email, or url property.'
		);
	}

	private buildPhoneContact(phone: string, context: string): ObIAccessibilityStatementContactInfo {
		return {
			label: phone,
			url: `tel:${phone}`,
			icon: ObEIcon.PHONE,
			context,
			isExternal: false,
		};
	}

	private buildMailContact(email: string, context: string): ObIAccessibilityStatementContactInfo {
		return {
			label: email,
			url: `mailto:${email}`,
			icon: ObEIcon.MAIL,
			context,
			isExternal: false,
		};
	}

	private buildUrlContact(url: string, context: string): ObIAccessibilityStatementContactInfo {
		const isExternal = url.startsWith('http');
		return {
			label: url,
			url,
			icon: isExternal ? ObEIcon.LINK_EXTERNAL : ObEIcon.LINK,
			context,
			isExternal,
		};
	}
}
