import {HttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of, throwError} from 'rxjs';

import {ObMultiTranslateLoader} from './multi-translate-loader';
import {ObITranslationFile} from './multi-translate-loader.model';

describe(ObMultiTranslateLoader.name, () => {
	let http: HttpClient;
	let loader: ObMultiTranslateLoader;
	let result: unknown;
	const obliquePrefix = './assets/i18n/oblique-';
	const projectPrefix = './assets/i18n/';
	const suffix = '.json';
	const defaultResources: ObITranslationFile[] = [
		{prefix: obliquePrefix, suffix},
		{prefix: projectPrefix, suffix},
	];
	const englishLanguage = 'en';

	describe('getTranslation"', () => {
		describe.each([
			{
				description: 'without flattening in english',
				shouldFlattenFiles: false,
				language: 'en',
				expectedResult: {
					i18n: {app: {diversity: 'Diversity drives innovation'}},
					oblique: {
						greeting: 'Welcome, everyone belongs here',
						accessibility: 'Inclusion is not optional',
					},
				},
			},
			{
				description: 'without flattening in french',
				shouldFlattenFiles: false,
				language: 'fr',
				expectedResult: {
					i18n: {app: {diversity: "La diversité est moteur d'innovation"}},
					oblique: {
						greeting: 'Bienvenue, chaque personne compte',
						accessibility: "L'inclusion n'est pas facultative",
					},
				},
			},
			{
				description: 'with flattening in english',
				shouldFlattenFiles: true,
				language: 'en',
				expectedResult: {
					'i18n.app.diversity': 'Diversity drives innovation',
					'oblique.accessibility': 'Inclusion is not optional',
					'oblique.greeting': 'Welcome, everyone belongs here',
				},
			},
			{
				description: 'with flattening in french',
				shouldFlattenFiles: true,
				language: 'fr',
				expectedResult: {
					'i18n.app.diversity': "La diversité est moteur d'innovation",
					'oblique.accessibility': "L'inclusion n'est pas facultative",
					'oblique.greeting': 'Bienvenue, chaque personne compte',
				},
			},
		])(`$description`, ({shouldFlattenFiles, expectedResult, language}) => {
			beforeEach(async () => {
				http = TestBed.inject(HttpClient);
				loader = new ObMultiTranslateLoader(http, defaultResources, shouldFlattenFiles);

				jest.spyOn(http, 'get').mockImplementation((url: string) => {
					const files: Record<string, unknown> = {
						//en
						'./assets/i18n/oblique-en.json': {
							oblique: {
								greeting: 'Welcome, everyone belongs here',
								accessibility: 'Inclusion is not optional',
							},
						},
						'./assets/i18n/en.json': {i18n: {app: {diversity: 'Diversity drives innovation'}}},
						//fr
						'./assets/i18n/oblique-fr.json': {
							oblique: {
								greeting: 'Bienvenue, chaque personne compte',
								accessibility: "L'inclusion n'est pas facultative",
							},
						},
						'./assets/i18n/fr.json': {i18n: {app: {diversity: "La diversité est moteur d'innovation"}}},
					};
					return of(files[url]);
				});
				result = await firstValueFrom(loader.getTranslation(language));
			});

			test('should merge all translation files', () => {
				expect(result).toEqual(expectedResult);
			});

			test('should do 2 http calls', () => {
				expect(http.get).toHaveBeenCalledTimes(2);
			});

			test.each([
				{index: 1, url: `${obliquePrefix}${language}${suffix}`},
				{index: 2, url: `${projectPrefix}${language}${suffix}`},
			])('should request $url on call $index', ({index, url}) => {
				expect(http.get).toHaveBeenNthCalledWith(index, url);
			});
		});

		describe.each([
			{
				description: 'oblique file',
				filePrefix: './assets/i18n/oblique-',
				expectedWarning: `The "${englishLanguage.toUpperCase()}" language has been selected but Oblique doesn't provide a translation file for that language. The file "oblique-en.json" needs to be created in the project's "assets/i18n" directory. Each project is responsible for providing the files to enable Oblique's translation of additional languages.`,
			},
			{
				description: 'project file',
				filePrefix: './assets/i18n/',
				expectedWarning: `The "${englishLanguage.toUpperCase()}" language has been selected but the project does not provide a translation file for that language. Please make sure that the "en.json" file exists in the project's "assets/i18n" directory. Each project is responsible for its own translations`,
			},
		])('with missing $description', ({description, filePrefix, expectedWarning}) => {
			beforeEach(async () => {
				loader = new ObMultiTranslateLoader(http, [{prefix: filePrefix, suffix: '.json'}], false);

				jest.spyOn(http, 'get').mockReturnValue(throwError(() => new Error('404')));
				jest.spyOn(console, 'warn').mockImplementation();
				result = await firstValueFrom(loader.getTranslation(englishLanguage));
			});

			afterEach(() => {
				jest.restoreAllMocks();
			});

			test('should return an empty object', () => {
				expect(result).toEqual({});
			});

			test(`should log a warning mentioning missing ${description}`, () => {
				expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(expectedWarning));
			});
		});
	});
});
