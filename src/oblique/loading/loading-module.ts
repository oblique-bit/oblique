import {LoadingServiceProvider} from './loading-service-provider';
import {ORNotificationModule} from '../notification/index';


export const ORLoadingModule = 'oblique-reactive.loading';

angular.module(ORLoadingModule, [ORNotificationModule])
    .provider('loadingService', () => new LoadingServiceProvider());