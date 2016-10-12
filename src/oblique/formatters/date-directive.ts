export class DateDirective implements ng.IDirective {
	restrict = 'E';
	scope = {
		date: '=date'
	};
	template = '{{ date | date : \'dd.MM.yyyy\'}}';
}
