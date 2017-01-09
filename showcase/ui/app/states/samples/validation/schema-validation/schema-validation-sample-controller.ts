import {NotificationService} from 'oblique-reactive/oblique-reactive';

// TODO: Fix the multiselect validation
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
		this.data.date = moment().format('YYYY-MM-DD');
		this.data.minDate = moment(this.data.date).subtract(1, 'd').format('YYYY-MM-DD');
		this.data.maxDate = moment(this.data.date).add(1, 'd').format('YYYY-MM-DD');
	}

	toTimestamp() {
		this.data.date = Date.now();
	}

	jsonSource(data) {
		return '<pre>' + this.$filter('json')(data) + '</pre>';
	}

	check(form) {
		if(!this.$scope.$broadcast('schemaValidationEvent').defaultPrevented) {
			if (form.$valid) {
				this.notificationService.success('Congratulations, your data is valid!');
			} else {
				this.notificationService.warn('Oups, your data does not look to be valid!');
			}
		}
	}
}
