import {NavigatorService} from './navigator-service';

export class NavigationDirectiveController {
    constructor (private $navigator: NavigatorService) {
        
    }

    up() {
        this.$navigator.up();
    }
}