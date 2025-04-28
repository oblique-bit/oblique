import {ObEPamsEnvironment} from '@oblique/oblique';
import type {Environment} from '../app/app.component.model';

export const environment: Environment = {
	production: true,
	banner: undefined,
	pams: {
		environment: ObEPamsEnvironment.REF
	}
};
