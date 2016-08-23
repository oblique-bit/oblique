import {NavigationDirectiveController} from './navigator-directive-controller';

export class NavigatorDirective implements ng.IDirective {
    restrict = 'E';
    replace = true;
    require = 'navigator';
    template =   `<a href='' ng-click='ctrl.up()'>
	                <span class='fa fa-chevron-left'></span>
			    </a>`;
    
    controller = NavigationDirectiveController;
    controllerAs = 'ctrl';

    constructor (private $document:ng.IDocumentService) {

    }
    
    link = (scope, element, attrs, ctrl:NavigationDirectiveController) => {
        let eventName = 'keyup.navigator';

        this.$document.on(eventName, (event) => {
            if (event.which === 27) { // ESC key
                event.preventDefault();
                ctrl.up();
            }
        });

        element.on('$destroy', () => {
            this.$document.off(eventName);
        });
    }
}
