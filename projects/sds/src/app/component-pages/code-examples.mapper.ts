import {Type} from '@angular/core';
import {AlertCodeExamplesComponent} from './code-examples/alert/alert-code-examples.component';
import {BannerCodeExamplesComponent} from './code-examples/banner/banner-code-examples.component';
import {CodeExamples} from './code-examples.model';
import {ButtonCodeExamplesComponent} from './code-examples/button/button-code-examples.component';
import {BadgeCodeExamplesComponent} from './code-examples/badge/badge-code-examples.component';
import {ListGroupCodeExamplesComponent} from './code-examples/list-group/list-group-code-examples.component';

export class CodeExamplesMapper {
	private static readonly codeExamples: Record<string, Type<CodeExamples>> = {
		alert: AlertCodeExamplesComponent,
		badge: BadgeCodeExamplesComponent,
		banner: BannerCodeExamplesComponent,
		button: ButtonCodeExamplesComponent,
		listGroup: ListGroupCodeExamplesComponent
	};

	static getCodeExampleComponent(slug: string): Type<CodeExamples> {
		return this.codeExamples[slug];
	}
}
