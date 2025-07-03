import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {ObTranslateParamsPipe} from '../translate-params/translate-params.pipe';
import {ObExternalLinkModule} from '../external-link/external-link.module';
import {ObConformity} from '../utilities.model';
import {OB_ACCESSIBILITY_STATEMENT_CONFIGURATION} from '../utilities';
import {ObDatePipe} from '../language/date.pipe';
import {ObAvailableInComponent} from './available-in/available-in.component';

@Component({
	selector: 'ob-accessibility-statement',
	imports: [ObExternalLinkModule, TranslateModule, ObTranslateParamsPipe, ObDatePipe, DatePipe, MatIcon, ObAvailableInComponent],
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
	readonly contactParameters = {
		emails: (this.parameters.contact as {emails: string[]}).emails ?? [],
		phones: (this.parameters.contact as {phones: string[]}).phones ?? []
	};
	readonly generalLinks = [
		{
			label: 'i18n.oblique.accessibility-statement.general-information.links.e-accessibility.label',
			url: 'i18n.oblique.accessibility-statement.general-information.links.e-accessibility.url',
			availableIn: ['de', 'fr', 'it']
		},
		{
			label: 'i18n.oblique.accessibility-statement.general-information.links.guidance.label',
			url: 'i18n.oblique.accessibility-statement.general-information.links.guidance.url',
			availableIn: ['de', 'fr', 'it']
		}
	];
	readonly accessibilityLinks = [
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.standard.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.standard.url',
			availableIn: ['de', 'fr']
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.ordinance.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.ordinance.url',
			availableIn: ['de', 'fr', 'it']
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.disability.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.disability.url'
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.equality.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.equality.url'
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.rights.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.rights.url',
			availableIn: ['de', 'fr', 'it']
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.principles.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.principles.url',
			availableIn: ['de', 'fr', 'it']
		}
	];

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
}
