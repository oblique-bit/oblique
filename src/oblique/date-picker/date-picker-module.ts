import {DatePickerComponent} from './date-picker-component';
import {DatePickerPopupDirective} from './date-picker-popup-directive';
import {ORErrorMessagesModule} from '../error-messages/index';
import {DatepickerPopupConfig} from './datepicker-config';

import '../../oblique-reactive-templates';

export const ORDatepickerModule = 'oblique-reactive.datepicker';

angular.module(ORDatepickerModule, ['oblique-reactive.app-templates', ORErrorMessagesModule])
    .config((uibDatepickerPopupConfig:DatepickerPopupConfig) => {
        uibDatepickerPopupConfig.showErrorMessages = true;
    })
    .component('datePicker', new DatePickerComponent())
    .directive('uibDatepickerPopup', (dateFilter, uibDateParser, uibDatepickerPopupConfig) => new DatePickerPopupDirective(
        dateFilter,
        uibDateParser,
        uibDatepickerPopupConfig
    ));