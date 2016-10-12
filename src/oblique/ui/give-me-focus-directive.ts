export class GiveMeFocusDirective implements ng.IDirective {
	restrict = 'A';
	link = (scope, element, attrs) => {
		if (scope.$eval(attrs.giveMeFocus)) {
			$(element).focus();
		}
	}
}
