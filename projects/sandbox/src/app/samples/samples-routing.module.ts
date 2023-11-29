import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ObUnsavedChangesGuard} from '@oblique/oblique';
import {SampleDataResolver} from '../resolvers/sample-data.resolver';
import {AlertSampleComponent} from './alert/alert.component';
import {BreadcrumbSampleComponent} from './breadcrumb/breadcrumb.component';
import {ButtonSampleComponent} from './button/button.component';
import {CollapseSampleComponent} from './collapse/collapse-sample.component';
import {ColumnLayoutSampleComponent} from './column-layout/column-layout-sample.component';
import {ColumnLayoutFullHeightSampleComponent} from './column-layout-full-height/column-layout-full-height-sample.component';
import {ErrorMessagesSampleComponent} from './error-messages-sample/error-messages-sample.component';
import {ExternalLinkComponent} from './external-link/external-link.component';
import {FileUploadSampleComponent} from './file-upload-sample/file-upload-sample.component';
import {FormSampleComponent} from './form/form.component';
import {GlobalEventsSampleComponent} from './global-events/global-events-sample.component';
import {HorizontalFormsSampleComponent} from './horizontal-forms/horizontal-forms.component';
import {HttpInterceptorSampleComponent} from './http-interceptor/http-interceptor-sample.component';
import {InputClearSampleComponent} from './input-clear/input-clear.component';
import {LanguageSampleComponent} from './language/language-sample.component';
import {MasterLayoutSampleComponent} from './master-layout/master-layout-sample.component';
import {MultiTranslateLoaderSampleComponent} from './multi-translate-loader/multi-translate-loader-sample.component';
import {NavTreeSampleComponent} from './nav-tree/nav-tree-sample.component';
import {NavTreeDetailSampleComponent} from './nav-tree/nav-tree-detail-sample.component';
import {NestedFormSampleComponent} from './nested-form/nested-form-sample.component';
import {NotificationSampleComponent} from './notification/notification-sample.component';
import {NumberFormatSampleComponent} from './number-format/number-format-sample.component';
import {PopUpSampleComponent} from './pop-up/pop-up-sample.component';
import {PopoverComponent} from './popover/popover.component';
import {SchemaValidationSampleComponent} from './schema-validation/schema-validation-sample.component';
import {SelectableSampleComponent} from './selectable/selectable-sample.component';
import {SpinnerSampleComponent} from './spinner-sample/spinner-sample.component';
import {StickySampleComponent} from './sticky/sticky-sample.component';
import {UnknownRouteSampleComponent} from './unknown-route/unknown-route-sample.component';
import {UnsavedChangesSampleComponent} from './unsaved-changes/unsaved-changes-sample.component';
import {AutocompleteSampleComponent} from './autocomplete/autocomplete.component';
import {ServiceNavigationSampleComponent} from './service-navigation/service-navigation-sample.component';

const samplesRoutes: Routes = [
	{path: 'alert', component: AlertSampleComponent},
	{path: 'alert/1', component: AlertSampleComponent},
	{path: 'alert/1/1', component: AlertSampleComponent},
	{path: 'alert/1/1/1', component: AlertSampleComponent},
	{path: 'alert/1/1/1/1', component: AlertSampleComponent},
	{path: 'alert/1/1/1/2', component: AlertSampleComponent},
	{path: 'alert/1/1/1/3', component: AlertSampleComponent},
	{path: 'alert/1/1/2', component: AlertSampleComponent},
	{path: 'alert/1/1/3', component: AlertSampleComponent},
	{path: 'alert/1/2', component: AlertSampleComponent},
	{path: 'alert/1/3', component: AlertSampleComponent},
	{path: 'alert/2', component: AlertSampleComponent},
	{path: 'alert/3', component: AlertSampleComponent},
	{path: 'autocomplete', component: AutocompleteSampleComponent},
	{
		path: 'breadcrumb',
		component: BreadcrumbSampleComponent,
		data: {breadcrumb: 'Breadcrumb Sample'},
		children: [
			{
				path: 'some-page',
				component: BreadcrumbSampleComponent,
				data: {breadcrumb: 'First Level'},
				children: [
					{
						path: 'some-sub-page',
						component: BreadcrumbSampleComponent,
						data: {breadcrumb: 'Sub-Page'},
						children: []
					}
				]
			},
			{
				path: 'missing-label',
				component: BreadcrumbSampleComponent
			},
			{
				path: 'i18n-label',
				component: BreadcrumbSampleComponent,
				data: {breadcrumb: 'i18n.oblique.header.navigation.title'}
			},
			{
				path: 'with-params/:param',
				component: BreadcrumbSampleComponent
			},
			{
				path: 'with-params-and-label/:param',
				component: BreadcrumbSampleComponent,
				data: {breadcrumb: 'i18n.routes.samples.breadcrumb.label-with-params'}
			},
			{
				path: ':param/details',
				component: BreadcrumbSampleComponent,
				data: {breadcrumb: ':param / Details'},
				children: [
					{
						path: 'missing-label',
						component: BreadcrumbSampleComponent,
						children: [
							{
								path: 'missing-label',
								component: BreadcrumbSampleComponent
							}
						]
					}
				]
			},
			{
				path: ':param',
				component: BreadcrumbSampleComponent
			}
		]
	},
	{path: 'button', component: ButtonSampleComponent},
	{path: 'collapse', component: CollapseSampleComponent},
	{path: 'collapse/1', component: CollapseSampleComponent},
	{path: 'collapse/2', component: CollapseSampleComponent},
	{path: 'collapse/3', component: CollapseSampleComponent},
	{path: 'collapse/4', component: CollapseSampleComponent},
	{path: 'collapse/5', component: CollapseSampleComponent},
	{path: 'collapse/6', component: CollapseSampleComponent},
	{path: 'collapse/7', component: CollapseSampleComponent},
	{path: 'collapse/8', component: CollapseSampleComponent},
	{path: 'collapse/9', component: CollapseSampleComponent},
	{path: 'collapse/10', component: CollapseSampleComponent},
	{path: 'collapse/11', component: CollapseSampleComponent},
	{path: 'collapse/12', component: CollapseSampleComponent},
	{path: 'collapse/13', component: CollapseSampleComponent},
	{path: 'collapse/14', component: CollapseSampleComponent},
	{path: 'collapse/15', component: CollapseSampleComponent},
	{path: 'collapse/16', component: CollapseSampleComponent},
	{path: 'collapse/17', component: CollapseSampleComponent},
	{path: 'collapse/18', component: CollapseSampleComponent},
	{path: 'collapse/19', component: CollapseSampleComponent},
	{path: 'collapse/20', component: CollapseSampleComponent},
	{path: 'column-layout', component: ColumnLayoutSampleComponent},
	{path: 'column-layout-full-height', component: ColumnLayoutFullHeightSampleComponent},
	{path: 'error-messages', component: ErrorMessagesSampleComponent},
	{path: 'external-link', component: ExternalLinkComponent},
	{path: 'file-upload', component: FileUploadSampleComponent},
	{path: 'form', component: FormSampleComponent},
	{path: 'form/1', component: FormSampleComponent},
	{path: 'global-events', component: GlobalEventsSampleComponent},
	{path: 'horizontal-forms', component: HorizontalFormsSampleComponent},
	{path: 'http-interceptor', component: HttpInterceptorSampleComponent},
	{path: 'input-clear', component: InputClearSampleComponent},
	{path: 'language', component: LanguageSampleComponent},
	{path: 'master-layout', component: MasterLayoutSampleComponent},
	{path: 'multi-translate-loader', component: MultiTranslateLoaderSampleComponent},
	{
		path: 'nav-tree',
		component: NavTreeSampleComponent,
		resolve: {
			sample: SampleDataResolver
		},
		children: [
			{path: ':section', component: NavTreeDetailSampleComponent},
			{path: ':section/:subsection', component: NavTreeDetailSampleComponent},
			{path: ':section/:subsection/:subsubsection', component: NavTreeDetailSampleComponent}
		]
	},
	{path: 'nested-form', component: NestedFormSampleComponent},
	{path: 'notification', component: NotificationSampleComponent},
	{path: 'number-format', component: NumberFormatSampleComponent},
	{path: 'pop-up', component: PopUpSampleComponent},
	{path: 'popover', component: PopoverComponent},
	{path: 'schema-validation', component: SchemaValidationSampleComponent},
	{path: 'selectable', component: SelectableSampleComponent},
	{path: 'service-navigation', component: ServiceNavigationSampleComponent},
	{path: 'sticky', component: StickySampleComponent},
	{path: 'spinner', component: SpinnerSampleComponent},
	{path: 'spinner/1', component: SpinnerSampleComponent},
	{path: 'spinner/2', component: SpinnerSampleComponent},
	{path: 'spinner/3', component: SpinnerSampleComponent},
	{path: 'spinner/4', component: SpinnerSampleComponent},
	{path: 'spinner/5', component: SpinnerSampleComponent},
	{path: 'unknown-route-sample', component: UnknownRouteSampleComponent},
	{path: 'unsaved-changes', component: UnsavedChangesSampleComponent, canDeactivate: [ObUnsavedChangesGuard]}
];

@NgModule({
	imports: [RouterModule.forChild(samplesRoutes)],
	exports: [RouterModule]
})
export class SamplesRoutingModule {}
