import {ClassProvider, EnvironmentProviders, InjectionToken, makeEnvironmentProviders} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
	MissingTranslationHandler,
	TranslateCompiler,
	TranslateLoader,
	TranslateModuleConfig,
	TranslateParser,
	provideTranslateService,
} from '@ngx-translate/core';
import {ObMultiTranslateLoader} from './multi-translate-loader';
import {ObITranslateConfig, ObITranslateConfigInternal} from './translation.model';
import {ObConsoleService} from '../console/ob-console.service';

export const OB_TRANSLATION_CONFIGURATION = new InjectionToken<ObITranslateConfigInternal>('Translation configuration');

export const defaultTranslationConfig: ObITranslateConfig = {flatten: true};

export function provideObliqueTranslations(configuration: ObITranslateConfig = {}): EnvironmentProviders {
	const {config, flatten, additionalFiles} = configuration;
	return makeEnvironmentProviders([
		provideTranslateService({
			loader: {
				provide: TranslateLoader,
				useFactory: getTranslateLoader,
				deps: [HttpClient, OB_TRANSLATION_CONFIGURATION, ObConsoleService],
			},
			...addProviders(config),
		}),
		{provide: OB_TRANSLATION_CONFIGURATION, useValue: {additionalFiles, flatten: flatten ?? true}},
	]);
}

function getTranslateLoader(
	http: HttpClient,
	config: ObITranslateConfigInternal,
	obConsole: ObConsoleService
): ObMultiTranslateLoader {
	const {additionalFiles, flatten} = config;
	return new ObMultiTranslateLoader(
		http,
		[
			{
				prefix: './assets/i18n/oblique-',
				suffix: '.json',
			},
			...(additionalFiles || [{prefix: './assets/i18n/', suffix: '.json'}]),
		],
		flatten,
		obConsole
	);
}

function addProviders(config: TranslateModuleConfig = {}): TranslateModuleConfig {
	const providers = {
		compiler: TranslateCompiler,
		loader: TranslateLoader,
		parser: TranslateParser,
		missingTranslationHandler: MissingTranslationHandler,
	} as const;
	const configWithProviders = {};
	Object.keys(config).forEach(option => {
		configWithProviders[option] =
			providers[option] && config[option] instanceof Function
				? ({provide: providers[option], useClass: config[option]} as ClassProvider)
				: config[option];
	});
	return configWithProviders;
}
