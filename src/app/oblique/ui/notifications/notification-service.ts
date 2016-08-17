export class NotificationService {

    warning = this.warn; // Alias only

    public notifications = [];

    //TODO: replace with enum?
    private types = {
        'default': {
            priority: 0
        },
        info: {
            priority: 1
        },
        success: {
            priority: 2
        },
        warning: {
            priority: 3
        },
        error: {
            priority: 4
        }
    };

    private currentId:number = 0;

    /*@ngInject*/
    constructor(private $timeout:ng.ITimeoutService,
                private providerContext) {
    }

    add(type:string, messageKey:string, title?:string, sticky?:boolean) {
        let notification = {
            id: this.currentId,
            type: type,
            messageKey: messageKey,
            title: title,
            sticky: type === 'error' || sticky
        };
        this.notifications.unshift(notification);
        this.notifications.sort(this.sortByType);
        if (!notification.sticky) {
            this.$timeout(() => {
                this.remove(notification.id);
            }, this.providerContext.timeout);
        }
        this.currentId++;
    }

    remove(id:number) {
        this.notifications.forEach((notification, index) => {
            if (id === notification.id) {
                this.notifications.splice(index, 1);
            }
        });
    }

    clear() {
        this.notifications.length = 0; // ;)
    }

    // Shortcuts:
    default(messageKey:string, title?:string, sticky?:boolean) {
        return this.add('default', messageKey, title, sticky);
    }

    info(messageKey:string, title?:string, sticky?:boolean) {
        return this.add('info', messageKey, title, sticky);
    }

    success(messageKey:string, title?:string, sticky?:boolean) {
        return this.add('success', messageKey, title, sticky);
    }

    warn(messageKey:string, title?:string, sticky?:boolean) {
        return this.add('warning', messageKey, title, sticky);
    }

    error(messageKey:string, title?:string, sticky?:boolean) {
        return this.add('error', messageKey, title, sticky);
    }

    //Otherwise it would lose the "this" context
    private sortByType = (a, b) => {
        return this.types[a.type].priority - this.types[b.type].priority;
    };
}