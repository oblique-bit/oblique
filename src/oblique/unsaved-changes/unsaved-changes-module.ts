import {UnsavedChangesDirective} from './unsaved-changes-directive';
import {UnsavedChangesService} from './unsaved-changes-service';
import {ORLoadingModule} from '../loading/index';

export const ORUnsavedChangesModule = 'oblique-reactive.unsavedChanges';

angular.module(ORUnsavedChangesModule, [ORLoadingModule])
	.service('unsavedChangesService', UnsavedChangesService)
	.directive('unsavedChanges', (unsavedChangesService: UnsavedChangesService) => new UnsavedChangesDirective(unsavedChangesService));