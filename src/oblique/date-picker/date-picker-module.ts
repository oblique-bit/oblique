import {DatePickerComponent} from './date-picker-component';
import {DatePickerPopupDirective} from './date-picker-popup-directive';
import {ORErrorMessageModule} from '../error-message/index';

import '../../oblique-reactive-templates';

export const ORDatepickerModule = 'oblique-reactive.datepicker';

angular.module(ORDatepickerModule, ['oblique-reactive.app-templates', ORErrorMessageModule])
    .component('datePicker', new DatePickerComponent())
    .directive('uibDatepickerPopup', (dateFilter, uibDateParser, uibDatepickerPopupConfig) => new DatePickerPopupDirective(
        dateFilter,
        uibDateParser,
        uibDatepickerPopupConfig
    ));