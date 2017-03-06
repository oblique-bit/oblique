import {httpDecorator} from './http-decorator';
import {HttpInterceptor} from './http-interceptor';
import {logDecorator} from './log-decorator';
import {ORLoadingModule} from '../loading/index';

// Export module's name so that it can be imported in the app-module of the business application:
export const ORInfrastructureModule = 'oblique-reactive.infrastructure';

angular.module(ORInfrastructureModule, [ORLoadingModule])
    .decorator('$http', httpDecorator)
    .service('HttpInterceptor', HttpInterceptor)
    .decorator('$log', logDecorator);