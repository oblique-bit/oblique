import {HttpDecorator} from './http-decorator';

export class ObliqueLog {
    private apiLogPath:string;

    constructor(private context: string,
                private $log:ng.ILogService,
                private CONFIG,
                private $injector:ng.auto.IInjectorService) {
        this.apiLogPath = CONFIG.api && CONFIG.api.logs;
    }

    log(...args) {
        this.logApi('log', [].slice.call(arguments));
    }

    info(...args) {
        this.logApi('info', [].slice.call(arguments));
    }

    warn(...args) {
        this.logApi('warn', [].slice.call(arguments));
    }

    error(...args) {
        this.logApi('error', [].slice.call(arguments));
    }

    debug(...args) {
        this.logApi('debug', [].slice.call(arguments));
    }

    private logApi(level: string, args: any[]) {
        let message = moment().format() + ' - [' + this.context + ']';

        if (args[0] && args[0] instanceof Error) {
            message += args[0].message;
        } else {
            message += JSON.stringify(args);
        }

        // Use $delegate as logger interface:
        this.$log[level](message);

        // Log to backend, if required:
        if (this.apiLogPath && !this.isFailedBackendLogRequest(args)) {
            let $http : HttpDecorator= this.$injector.get<HttpDecorator>('$http');
            $http.api.post(this.apiLogPath, {level: level, message: message, silent: true});
        }
    }

    private isFailedBackendLogRequest(args) {
        return args && args[0] && args[0].config && args[0].config.url && args[0].config.url.indexOf(this.apiLogPath) > -1;
    }
}