import {ORDatepickerModule} from './date-picker/index';
import {ORErrorMessageModule} from './error-message/index';
import {ORFormControlModule} from './form-control/index';
import {ORInfrastructureModule} from './infrastructure/index';
import {ORLoadingModule} from './loading/index';
import {ORMultiselectModule} from './multiselect/index';
import {ORNavigableModule} from './navigable/index';
import {ORNavigatorModule} from './navigator/index';
import {ORNotificationModule} from './notification/index';
import {ORSchemaValidationModule} from './schema-validation/index';
import {ORTopControlModule} from './top-control/index';
import {ORTypeaheadModule} from './typeahead/index';
import {ORUnsavedChangesModule} from './unsaved-changes/index';
import {ORUtilModule} from './util/index';


// Make sure that required templates for oblique-reactive will be loaded (and bundled):

import '../oblique-reactive-templates';

// Export module's name so that it can be imported in the app-module of the business application:
export const ObliqueModule = 'oblique-reactive';

angular.module(ObliqueModule, [
    'oblique-reactive.app-templates',
    ORDatepickerModule,
    ORErrorMessageModule,
    ORFormControlModule,
    ORInfrastructureModule,
    ORLoadingModule,
    ORMultiselectModule,
    ORNavigableModule,
    ORNavigatorModule,
    ORNotificationModule,
    ORSchemaValidationModule,
    ORTopControlModule,
    ORTypeaheadModule,
    ORUnsavedChangesModule,
    ORUtilModule
]);