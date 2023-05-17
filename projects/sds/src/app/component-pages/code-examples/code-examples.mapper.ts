import {Type} from '@angular/core';
import {AlertCodeExamplesComponent} from './alert/alert-code-examples.component';
import {BannerCodeExamplesComponent} from './banner/banner-code-examples.component';
import {CodeExamples} from './code-examples.model';

export class CodeExamplesMapper {
	private static readonly codeExamples: Record<string, Type<CodeExamples>> = {
		alert: AlertCodeExamplesComponent,
		banner: BannerCodeExamplesComponent
	};

	static getCodeExampleComponent(slug: string): Type<CodeExamples> {
		return this.codeExamples[slug];
	}
}
