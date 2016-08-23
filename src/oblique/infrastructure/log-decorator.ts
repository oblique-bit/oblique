import {ObliqueLog} from './oblique-log';

/*@ngInject*/
export function logDecorator(CONFIG, $delegate, $injector: ng.auto.IInjectorService) : LogDecorator {

    $delegate.getInstance = (context: string) => {
        return new ObliqueLog(
            context,
            $delegate,
            CONFIG,
            $injector);
    };

    return $delegate;
}
//TODO: move this?
export interface LogDecorator extends ng.ILogService {
    getInstance: (context:string) => ObliqueLog;
}

