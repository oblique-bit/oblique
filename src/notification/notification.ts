export class Notification {
    constructor(
        public id : number,
        public type : NotificationTypes,
        public messageKey : string,
        public title: string,
        public sticky: boolean
    ) {

    }
}
//TODO: separate file?
//http://stackoverflow.com/questions/15490560/create-an-enum-with-string-values-in-typescript
export class NotificationTypes {
    constructor(public name:string, public priority : number) {
        //
    }

    toString() {
        return this.name;
    }

    // values
    static DEFAULT = new NotificationTypes('default',0);
    static INFO = new NotificationTypes('info',1);
    static SUCCESS = new NotificationTypes('success',2);
    static WARNING = new NotificationTypes('warning',3);
    static ERROR = new NotificationTypes('error',4);

}