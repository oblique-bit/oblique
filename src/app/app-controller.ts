import {LoadingService} from './oblique/status/loading-service';
import {AuthService} from './common/auth/auth-service';
import {ObliqueLog} from './oblique/infrastructure/oblique-log';
import {LogDecorator} from './oblique/infrastructure/log-decorator';
import {NotificationService} from './oblique/ui/notifications/notification-service';

export class AppController {
    log:ObliqueLog;
    context;
    spinner:boolean;
    title:string;
    page = {
        layout: {},
        title: '',
        description: ''
    };
    locale = {
        current: 'en',
        use: (locale) => {
            this.$translate.use(locale);
        }
    };

    /*@ngInject*/
    constructor(CONFIG,
                $rootScope:ng.IRootScopeService,
                $state:ng.ui.IStateService,
                private $translate:ng.translate.ITranslateService,
                private $sce,
                $log:LogDecorator,
                tmhDynamicLocale:ng.dynamicLocale.tmhDynamicLocaleService,
                private authService:AuthService,
                loadingService:LoadingService,
                notificationService:NotificationService) {
        this.log = $log.getInstance('AppController');

        // Global properties:
        this.context = authService.context;
        this.spinner = loadingService.loading;
        this.title = CONFIG.title;
        if (CONFIG.description) {
            this.page.description = CONFIG.description || '';
        }
        if (CONFIG.defaults.locale) {
            this.locale.current = CONFIG.defaults.locale;
        }


        // Global events handling:
        $rootScope.$on('$httpInterceptorError', (event, response) => {
            if (response.data && response.data.errors) {
                event.preventDefault();
                response.data.errors.forEach((error, index) => {
                    notificationService.add(error.severity, 'error.business.' + error.messageKey);
                });
            }
        });

        $rootScope.$on('$stateChangeStart', (event, toState:ng.ui.IState) => {
            notificationService.clear();
            if (toState.resolve) {
                this.spinner = true;
            }
        });

        $rootScope.$on('$stateChangeSuccess', (event, toState:ng.ui.IState) => {
            this.page.layout = toState.data && toState.data.layout ? toState.data.layout : {};
            this.page.title = toState.data && toState.data.title ? toState.data.title : 'states.' + toState.name + '.title';
            this.page.description = toState.data && toState.data.description ? toState.data.description : (CONFIG.description || '');
            this.spinner = false;
        });

        $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
            this.log.error(error);
            this.spinner = false;
            $state.reload();
        });

        $rootScope.$on('$translateChangeSuccess', (event, data) => {
            tmhDynamicLocale.set(data.language);
            this.locale.current = data.language;
        });

        // Try to resolve & authenticate user, if any:
        // FIXME: this should be resolved in another way, cf: https://github.com/angular/angular.js/issues/5854
        authService.resolve();
    }

    // Global actions:
    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    isAuthorized(roles:string|string[]) {
        return this.authService.isAuthorized(roles);
    }

    logout() {
        return this.authService.logout();
    }

    // Utilities:
    safeHtml(html) {
        return this.$sce.trustAsHtml(html);
    }
}
