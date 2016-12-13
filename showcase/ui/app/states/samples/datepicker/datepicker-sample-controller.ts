import {NotificationService} from 'oblique-reactive/oblique-reactive';

export class DatepickerSampleController {
	data = {
		date: null,
		minMax: {
			date: null,
			min: moment().subtract(1, 'w').toDate(),
			max: moment().add(1, 'w').toDate()
		},
		range: {
			from: null,
			to: null
		},
		editable: {
			date: new Date(),
			enabled: false
		},
		disabled: {
			date: new Date(),
			enabled: true
		}
	};

	/*@ngInject*/
	constructor(private notificationService: NotificationService) {
	}

	today() {
		this.data.date = new Date();
	}

	toISO() {
		this.data.date = moment().format('YYYY-MM-DD');
	}

	toTimestamp() {
		this.data.date = Date.now();
	}

	invalidMin() {
		this.data.minMax.date = moment(this.data.minMax.min).subtract(1, 'd').toDate();
	}

	invalidMax() {
		this.data.minMax.date = moment(this.data.minMax.max).add(1, 'd').toDate();
	}

	toggleEditable() {
		this.data.editable.enabled = !this.data.editable.enabled;
	}

	toggleDisabled() {
		this.data.disabled.enabled = !this.data.disabled.enabled;
	}

	check(form) {
		if (form.$valid) {
			this.notificationService.success('Congratulations, form is valid!');
		}
	}
}
