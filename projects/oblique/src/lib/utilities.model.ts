import {ObIconConfig} from './icon/icon.model';
import {ObIAccessibilityStatementConfiguration} from './accessibility-statement/accessibility-statement.model';
import {ObIMaterialConfig} from './material/material.model';
import {ObITranslateConfig} from './translation/translation.model';
import {ObConsoleConfiguration} from './console/ob-console.model';
import {ObTBanner} from './banner/banner.model';

export interface ObIObliqueConfiguration {
	accessibilityStatement: ObIAccessibilityStatementConfiguration;
	historyState?: ObIHistoryState;
	banner?: ObTBanner;
	material?: ObIMaterialConfig;
	icon?: ObIconConfig;
	translate?: ObITranslateConfig;
	hasLanguageInUrl?: boolean;
	consoleConfiguration?: ObConsoleConfiguration;
}

export interface ObIHistoryState {
	initialLength: number;
}

export type ObIObliqueTestingConfiguration = Omit<ObIObliqueConfiguration, 'accessibilityStatement'> & {
	accessibilityStatement?: ObIAccessibilityStatementConfiguration;
};

export type ObIObliqueConfigurationWithDefaults = Omit<
	ObIObliqueConfiguration,
	'accessibilityStatement' | 'material' | 'icon' | 'translate' | 'hasLanguageInUrl'
> & {
	accessibilityStatement: ObIAccessibilityStatementConfiguration;
	historyState: ObIHistoryState;
	banner: ObTBanner;
	material: Required<NonNullable<ObIObliqueConfiguration['material']>>;
	icon: NonNullable<ObIObliqueConfiguration['icon']>;
	translate: NonNullable<ObIObliqueConfiguration['translate']>;
	hasLanguageInUrl: NonNullable<ObIObliqueConfiguration['hasLanguageInUrl']>;
	consoleConfiguration: ObConsoleConfiguration;
};

export type DeepPartial<Type> = Type extends object ? {[Property in keyof Type]?: DeepPartial<Type[Property]>} : Type;

export type NonEmptyArray<Type> = [Type, ...Type[]];
