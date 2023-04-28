import {ObEPamsEnvironment, ObIBanner} from '@oblique/oblique';

export interface Environment {
	production: boolean;
	banner?: ObIBanner;
	pams?: {
		environment: ObEPamsEnvironment;
		rootUrl?: string;
	};
}
