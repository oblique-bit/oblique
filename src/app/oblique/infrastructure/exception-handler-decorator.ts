import {LogDecorator} from './log-decorator';
import {ObliqueLog} from './oblique-log';

/*@ngInject*/
export function exceptionHandlerDecorator($delegate, $log : LogDecorator) {
    let LOG : ObliqueLog= $log.getInstance('$exceptionHandler');
    return (exception, cause) => {
        LOG.error(exception, cause);
    };
}
