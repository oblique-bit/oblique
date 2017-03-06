import {TopControlController} from './top-control-controller';

/**
 * Wrapper for the ObliqueUI TopControl component.
 *
 * @see https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-feedback-top-control
 */
export class TopControlComponent implements ng.IComponentOptions {
	templateUrl = 'oblique/top-control/top-control.tpl.html';
	controller = TopControlController;
	controllerAs = 'orTopControlCtrl';
}