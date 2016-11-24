import {DateDirective} from './formatters/date-directive';
import {NumberFormatDirective} from './formatters/number-format-directive';
import {exceptionHandlerDecorator} from './infrastructure/exception-handler-decorator';
import {httpDecorator} from './infrastructure/http-decorator';
import {HttpInterceptor} from './infrastructure/http-interceptor';
import {logDecorator, LogDecorator} from './infrastructure/log-decorator';
import {NavigatorDirective} from './navigator/navigator-directive';
import {NavigatorService} from './navigator/navigator-service';
import {LoadingServiceProvider} from './status/loading-service-provider';
import {DatePickerDirective} from './ui/date-picker/date-picker-directive';
import {NotificationsDirective} from './ui/notifications/notifications-directive';
import {DelayedChangeDirective} from './ui/delayed-change-directive';
import {DropdownClosableDirective} from './ui/dropdown-closable-directive';
import {EnterDirective} from './ui/enter-directive';
import {GiveMeFocusDirective} from './ui/give-me-focus-directive';
import {MultiselectDirective} from './ui/multiselect/multiselect-directive';
import {MultiselectConfig} from './ui/multiselect/multiselect-config';
import {NavigableDirective} from './ui/navigable-directive';
import {UibTypeaheadDirective} from './ui/typeahead-directive';
import {HasErrorDirective} from './validation/has-error-directive';
import {ValidationSchemaDirective} from './validation/validate-schema-directive';
import {SchemaValidatorService} from './validation/schema-validator-service';
import {NotificationServiceProvider} from './ui/notifications/notification-service-provider';
import {DatePickerPopupDirective} from './ui/date-picker/date-picker-popup-directive';
import {UibTypeaheadPopupDirective} from './ui/typeahead-popup-directive';
import {ValidationBusinessDirective} from './validation/validation-business-directive';
import {SchemaValidateDirective} from './validation/schema-validate-directive';
import {SchemaValidateConfig} from './validation/schema-validate-config';
import {BackToTopDirective} from './ui/back-to-top/back-to-top-directive';

//Makes sure, that the oblique-reactive-templates will be loaded (and bundled)
import '../oblique-reactive-templates';

//exports the name of the module, this needs to be imported in the app-module of the application
export const ObliqueModule = 'oblique-reactive';

angular.module(ObliqueModule, ['oblique-reactive.app-templates'])
	.directive('date', () => new DateDirective())
	.directive('numberFormat', ($filter:ng.IFilterService, $parse:ng.IParseService) => new NumberFormatDirective($filter, $parse))
	.decorator('$exceptionHandler', exceptionHandlerDecorator)
	.decorator('$http', httpDecorator)
	.service('HttpInterceptor', HttpInterceptor)
	.decorator('$log', logDecorator)
	.directive('navigator', ($document:ng.IDocumentService) => new NavigatorDirective($document))
	.service('$navigator', NavigatorService)
	.provider('loadingService', () => new LoadingServiceProvider())
	.directive('datePicker', () => new DatePickerDirective())
	.directive('uibDatepickerPopup', (dateFilter, uibDateParser, uibDatepickerPopupConfig) => new DatePickerPopupDirective(
		dateFilter,
		uibDateParser,
		uibDatepickerPopupConfig
	))
	.provider('notificationService', () => new NotificationServiceProvider())
	.directive('notifications', () => new NotificationsDirective())
	.directive('delayedChange', () => new DelayedChangeDirective())
	.directive('dropdownClosable', ($timeout:ng.ITimeoutService) => new DropdownClosableDirective($timeout))
	.directive('enter', () => new EnterDirective())
	.directive('giveMeFocus', () => new GiveMeFocusDirective())
	.constant('multiselectConfig', new MultiselectConfig())
	.directive('multiselect', () => new MultiselectDirective())
	.directive('navigable', ($timeout:ng.ITimeoutService) => new NavigableDirective($timeout))
	.directive('uibTypeahead', () => new UibTypeaheadDirective())
	.directive('uibTypeaheadPopup', () => new UibTypeaheadPopupDirective())
	.directive('hasError', () => new HasErrorDirective())
	.constant('schemaValidateConfig', new SchemaValidateConfig())
	.directive('validationSchema', ()=> new ValidationSchemaDirective())
	.directive('validationBusiness', ($log:LogDecorator) => new ValidationBusinessDirective($log))
	.directive('schemaValidate', ($log:LogDecorator,
	                              $timeout:ng.ITimeoutService,
	                              schemaValidator:SchemaValidatorService) => new SchemaValidateDirective($log, $timeout, schemaValidator))
	.directive('backToTop', () => new BackToTopDirective)
	.service('schemaValidator', SchemaValidatorService);
