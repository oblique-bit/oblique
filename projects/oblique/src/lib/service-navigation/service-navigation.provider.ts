import {InjectionToken} from '@angular/core';
import {ObIPamsConfiguration} from './service-navigation.model';

export const OB_PAMS_CONFIGURATION = new InjectionToken<ObIPamsConfiguration>(
	'Provides the mandatory PAMS environment as well as an optional root url.'
);
