import type {ObEPamsEnvironment, ObTBanner} from '@oblique/oblique';

export interface Environment {
	production: boolean;
	banner?: ObTBanner;
	pams?: {
		environment: ObEPamsEnvironment;
		rootUrl?: string;
	};
}
