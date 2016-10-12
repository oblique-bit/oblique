export class EnterDirective implements ng.IDirective {
	restrict = 'A';

	link = (scope, element, attrs) => {
		element.keydown((e) => {
			if (e.keyCode === 13 && element.is(e.target)) {
				scope.$apply(() => {
					scope.$eval(attrs.enter);
				});
				e.preventDefault();
			}
		});
	}
}
