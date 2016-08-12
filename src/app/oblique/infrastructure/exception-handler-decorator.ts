import {LogDecorator, ObliqueLog} from './log-decorator';

/*@ngInject*/
export function exceptionHandlerDecorator($delegate, $log : LogDecorator) {
    let LOG : ObliqueLog= $log.getInstance('$exceptionHandler');
    return (exception, cause) => {
        LOG.error(exception, cause);
    };
}

/*export function exceptionHandlerDecorator($provide) {
 // TODO: ngInject needed?
 $provide.decorator('$exceptionHandler', ($delegate, $injector) => {
 let LOG = $injector.get('$log').getInstance('$exceptionHandler');
 return (exception, cause) => {
 LOG.error(exception, cause);
 };
 });
 }*/
