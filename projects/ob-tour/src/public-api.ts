/*
 * Public API Surface of ob-tour
 */

export {
	ObtTour,
	ObtBadgePosition,
	ObtMenuPosition,
	ObtMenuPositionsY,
	ObtMenuPositionsX,
	ObtToursConfig,
	ObtTourTrigger,
	ObtTargetElement,
	ObtTourStep
} from './lib/models/tour.model';
export {ObtTourComponent} from './lib/tour-menu/tour.component';
export {provideTourTranslations, ObtTourTranslationFactoryService} from './lib/services/tour-translation-factory.service';
