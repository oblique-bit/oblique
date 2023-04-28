import {ObEPamsEnvironment} from '@oblique/oblique';
import {Environment} from '../app/app.component.model';

export const environment: Environment = {
	production: true,
	banner: undefined,
	pams: {
		environment: ObEPamsEnvironment.TEST
	}
};
