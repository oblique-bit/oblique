export class NavigableSampleController {

	//TODO: add custom-typings?
	scientistsSelection = [];
	scientists = [
		{
			firstname : 'Albert',
			lastname : 'Einstein',
			birthdate : '14.03.1879'
		},
		{
			firstname : 'Isaac',
			lastname : 'Newton',
			birthdate : '04.01.1643'
		},
		{
			firstname : 'Galileo',
			lastname : 'Galilei',
			birthdate : '15.02.1564'
		}
	];

	/*@ngInject*/
	constructor ($timeout:ng.ITimeoutService) {
		// Set focus on first navigable list item:
		// FIXME: this should be set by ng-repeat or navigable:
		$timeout(() => {
			$('.list-group .list-group-item:nth-child(2)').focus();
		});
	}
}
