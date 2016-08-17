import {NotificationService} from '../../../oblique/ui/notifications/notification-service';

//TODO: Fix the multiselect validation
export class SchemaValidationSampleController {
    
    /*@ngInject*/
    constructor(private $scope:ng.IScope,
                private $filter:ng.IFilterService,
                public schema,
                public data,
                private notificationService:NotificationService) {
    }

    today() {
        this.data.date = new Date();
        this.data.minDate = moment(this.data.date).subtract(1, 'd').toDate();
        this.data.maxDate = moment(this.data.date).add(1, 'd').toDate();
    }

    toISO() {
        this.data.date = (new Date()).toISOString();
        this.data.minDate = moment(this.data.date).subtract(1, 'd').format('YYYY-MM-DD');
        this.data.maxDate = moment(this.data.date).add(1, 'd').format('YYYY-MM-DD');
    }

    toTimestamp() {
        this.data.date = Date.now();
    }

    check(form) {
        this.$scope.$broadcast('validationSchemaEvent');
        if (form.$valid) {
            this.notificationService.success('Congratulations, form is valid!');
        }
    }

    jsonSource(data) {
        return '<pre>' + this.$filter('json')(data) + '</pre>';
    }

}
