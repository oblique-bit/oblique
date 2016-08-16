import {NotificationService} from '../ui/notifications/notification-service';
export class LoadingService {

    public loading = {
        active: false
    };

    private loadings = [];
    private loadingId : number = 0;
    
    constructor(private $timeout:ng.ITimeoutService,
                private notificationService: NotificationService,
                private providerContext) {
        //
    }


    start() {
        // Store id for later comparison:
        let id = this.loadingId;
        // Create timeout and fail in case request takes too long to execute:
        this.loadings.push({
            id: this.loadingId,
            timeout: this.$timeout(() => {
                // when timeout, search if timeout is still active, when yes show error
                let loading = this.loadings.filter((loading) => {
                    return loading.id === id;
                });

                if (typeof loading !== 'undefined') {
                    this.stop();
                    this.notificationService.error('error.other.timeout');
                }
                
            }, this.providerContext.timeout)
        });
        this.loadingId++;
        this.loading.active = this.loadings.length > 0;
    }

    stop() {
        // do nothing when no loadings are active
        if (this.loadings.length > 0) {
            this.$timeout.cancel(this.loadings.shift().timeout);
            this.loading.active = this.loadings.length > 0;
        }
    }


}
