import {BackToTopDirectiveController} from './back-to-top-directive-controller';

export class BackToTopDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'oblique/ui/back-to-top/back-to-top.tpl.html';
    replace = true;
    scope = false;
    controller = BackToTopDirectiveController;
    controllerAs = 'ctrl';
}