/* eslint-disable @typescript-eslint/naming-convention */
import {AlertCodeExamplesComponent} from './code-examples/alert/alert-code-examples.component';
import {AutocompleteCodeExamplesComponent} from './code-examples/autocomplete/autocomplete-code-examples.component';
import {BadgeCodeExamplesComponent} from './code-examples/badge/badge-code-examples.component';
import {BannerCodeExamplesComponent} from './code-examples/banner/banner-code-examples.component';
import {ButtonCodeExamplesComponent} from './code-examples/button/button-code-examples.component';
import {CardCodeExamplesComponent} from './code-examples/card/card-code-examples.component';
import {ChipsCodeExamplesComponent} from './code-examples/chips/chips-code-examples.component';
import {CodeExamples} from './code-examples.model';
import {ColumnLayoutCodeExamplesComponent} from './code-examples/column-layout/column-layout-code-examples.component';
import {DatepickerCodeExamplesComponent} from './code-examples/datepicker/datepicker-code-examples.component';
import {DialogCodeExamplesComponent} from './code-examples/dialog/dialog-code-examples.component';
import {FileUploadCodeExamplesComponent} from './code-examples/file-upload/file-upload-code-examples.component';
import {FormCodeExamplesComponent} from './code-examples/form/form-code-examples.component';
import {GridSystemCodeExamplesComponent} from './code-examples/grid-system/grid-system-code-examples.component';
import {HtmlTableCodeExamplesComponent} from './code-examples/html-table/html-table-code-examples.component';
import {ListGroupCodeExamplesComponent} from './code-examples/list-group/list-group-code-examples.component';
import {MasterLayoutCodeExamplesComponent} from './code-examples/master-layout/master-layout-code-examples.component';
import {MaterialTableCodeExamplesComponent} from './code-examples/material-table/material-table-code-examples.component';
import {NavTreeCodeExamplesComponent} from './code-examples/nav-tree/nav-tree-code-examples.component';
import {NestedFormCodeExamplesComponent} from './code-examples/nested-form/nested-form-code-examples.component';
import {NotificationCodeExamplesComponent} from './code-examples/notification/notification-code-examples.component';
import {NumberFormatCodeExamplesComponent} from './code-examples/number-format/number-format-code-examples.component';
import {OffCanvasCodeExamplesComponent} from './code-examples/off-canvas/off-canvas-code-examples.component';
import {PaginatorCodeExamplesComponent} from './code-examples/paginator/paginator-code-examples.component';
import {PopoverCodeExamplesComponent} from './code-examples/popover/popover-code-examples.component';
import {ProgressBarCodeExamplesComponent} from './code-examples/progress-bar/progress-bar-code-examples.component';
import {PublicScssVariablesAndMixinsCodeExamplesComponent} from './code-examples/public-scss-variables-and-mixins/public-scss-variables-and-mixins-code-examples.component';
import {SelectableCodeExamplesComponent} from './code-examples/selectable/selectable-code-examples.component';
import {SlideToggleCodeExamplesComponent} from './code-examples/slide-toggle/slide-toggle-code-examples.component';
import {SliderCodeExamplesComponent} from './code-examples/slider/slider-code-examples.component';
import {SpinnerCodeExamplesComponent} from './code-examples/spinner/spinner-code-examples.component';
import {StepperCodeExamplesComponent} from './code-examples/stepper/stepper-code-examples.component';
import {StickyCodeExamplesComponent} from './code-examples/sticky/sticky-code-examples.component';
import {TabsCodeExamplesComponent} from './code-examples/tabs/tabs-code-examples.component';
import {TooltipCodeExamplesComponent} from './code-examples/tooltip/tooltip-code-examples.component';
import {TranslateParamsCodeExamplesComponent} from './code-examples/translate-params/translate-params-code-examples.component';
import {Type} from '@angular/core';
/* These imports are sorted alphabetically to reduce merge conflicts.
   If you add a new import above, please make sure it is sorted
   correctly as well to do your part in preventing merge conflicts. */

export class CodeExamplesMapper {
	private static readonly codeExamples: Record<string, Type<CodeExamples>> = {
		alert: AlertCodeExamplesComponent,
		autocomplete: AutocompleteCodeExamplesComponent,
		badge: BadgeCodeExamplesComponent,
		banner: BannerCodeExamplesComponent,
		button: ButtonCodeExamplesComponent,
		card: CardCodeExamplesComponent,
		chips: ChipsCodeExamplesComponent,
		columnLayout: ColumnLayoutCodeExamplesComponent,
		datepicker: DatepickerCodeExamplesComponent,
		dialog: DialogCodeExamplesComponent,
		fileUpload: FileUploadCodeExamplesComponent,
		form: FormCodeExamplesComponent,
		gridSystem: GridSystemCodeExamplesComponent,
		htmlTable: HtmlTableCodeExamplesComponent,
		listGroup: ListGroupCodeExamplesComponent,
		masterLayout: MasterLayoutCodeExamplesComponent,
		materialTable: MaterialTableCodeExamplesComponent,
		navTree: NavTreeCodeExamplesComponent,
		nestedForm: NestedFormCodeExamplesComponent,
		notification: NotificationCodeExamplesComponent,
		numberFormat: NumberFormatCodeExamplesComponent,
		offCanvas: OffCanvasCodeExamplesComponent,
		paginator: PaginatorCodeExamplesComponent,
		popover: PopoverCodeExamplesComponent,
		progressBar: ProgressBarCodeExamplesComponent,
		publicScssVariablesAndMixins: PublicScssVariablesAndMixinsCodeExamplesComponent,
		selectable: SelectableCodeExamplesComponent,
		slider: SliderCodeExamplesComponent,
		slideToggle: SlideToggleCodeExamplesComponent,
		spinner: SpinnerCodeExamplesComponent,
		stepper: StepperCodeExamplesComponent,
		sticky: StickyCodeExamplesComponent,
		tabs: TabsCodeExamplesComponent,
		tooltip: TooltipCodeExamplesComponent,
		'translate-params': TranslateParamsCodeExamplesComponent
	};

	static getCodeExampleComponent(slug: string): Type<CodeExamples> | undefined {
		return this.codeExamples[slug];
	}
}
