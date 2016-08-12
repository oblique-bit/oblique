import {NavigatorService} from './navigator-service';

export class NavigatorDirective implements ng.IDirective {
    restrict = 'E';
    replace = true;
    template =   `<a href='' ng-click='up()'>
	                <span class='fa fa-chevron-left'></span>
			    </a>`;

    constructor (private $navigator: NavigatorService,
                 private $document:ng.IDocumentService) {

    }
    
    link = (scope, element, attrs) => {
        let eventName = 'keyup.navigator';

        //TODO: remove up() from scope and add to a controller?
        scope.up = () => {
            this.$navigator.up();
        };

        this.$document.on(eventName, (event) => {
            if (event.which === 27) { // ESC key
                event.preventDefault();
                scope.up();
            }
        });

        element.on('$destroy', () => {
            this.$document.off(eventName);
        });
    }
}
