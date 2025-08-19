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

@Component({
	selector: 'ob-accessibility-statement',
	imports: [ObExternalLinkModule, TranslateModule, ObTranslateParamsPipe, ObDatePipe, DatePipe, MatIcon],
	templateUrl: './accessibility-statement.component.html',
	styleUrl: './accessibility-statement.component.scss'
})
export class AccessibilityStatementComponent {
	readonly parameters = inject(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION);
	readonly exceptions = 'exceptions' in this.parameters && this.parameters.exceptions.length > 0 ? this.parameters.exceptions : [];
	readonly statementParameters = {
		applicationName: this.parameters.applicationName,
		conformity: this.getConformity(this.parameters.conformity),
		exceptionText: this.getConformityText(this.exceptions.length > 0)
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

	private parseContact(contact: ObContactData): {label: string; url: string; icon: ObEIcon; context?: string} {
		if (contact.phone) {
			return {
				label: contact.phone,
				url: `tel:${contact.phone}`,
				icon: ObEIcon.PHONE,
				context: contact.context
			};
		}

		return {
			label: contact.email,
			url: `mailto:${contact.email}`,
			icon: ObEIcon.MAIL,
			context: contact.context
		};
	}
}
