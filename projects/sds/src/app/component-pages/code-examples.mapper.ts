import {Type} from '@angular/core';
import {AlertCodeExamplesComponent} from './code-examples/alert/alert-code-examples.component';
import {BannerCodeExamplesComponent} from './code-examples/banner/banner-code-examples.component';
import {CodeExamples} from './code-examples.model';
import {ButtonCodeExamplesComponent} from './code-examples/button/button-code-examples.component';
import {BadgeCodeExamplesComponent} from './code-examples/badge/badge-code-examples.component';
import {ListGroupCodeExamplesComponent} from './code-examples/list-group/list-group-code-examples.component';
import {DatepickerCodeExamplesComponent} from './code-examples/datepicker/datepicker-code-examples.component';
import {PaginatorCodeExamplesComponent} from './code-examples/paginator/paginator-code-examples.component';
import {SliderCodeExamplesComponent} from './code-examples/slider/slider-code-examples.component';
import {CardCodeExamplesComponent} from './code-examples/card/card-code-examples.component';
import {ChipsCodeExamplesComponent} from './code-examples/chips/chips-code-examples.component';

export class CodeExamplesMapper {
	private static readonly codeExamples: Record<string, Type<CodeExamples>> = {
		alert: AlertCodeExamplesComponent,
		badge: BadgeCodeExamplesComponent,
		banner: BannerCodeExamplesComponent,
		button: ButtonCodeExamplesComponent,
		card: CardCodeExamplesComponent,
		chips: ChipsCodeExamplesComponent,
		datepicker: DatepickerCodeExamplesComponent,
		listGroup: ListGroupCodeExamplesComponent,
		paginator: PaginatorCodeExamplesComponent,
		slider: SliderCodeExamplesComponent
	};

	static getCodeExampleComponent(slug: string): Type<CodeExamples> {
		return this.codeExamples[slug];
	}
}
