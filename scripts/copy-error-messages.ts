import {readFileSync, readdirSync, writeFileSync} from 'fs';
import path from 'path';

class CopyErrorMessages {
	static perform(): void {
		const basePath = path.join('projects', 'oblique', 'src', 'assets', 'i18n');
		const messagePath = path.join('projects', 'oblique', 'src', 'lib', 'error-messages', 'error-messages.description.html');
		writeFileSync(messagePath, CopyErrorMessages.adaptMessages(CopyErrorMessages.getTranslations(basePath), readFileSync(messagePath).toString()));
	}

	private static adaptMessages(translations: Record<string, string>, messages: string): string {
		return Object.keys(translations).reduce(
			(outerMsg, language) =>
				Object.keys(translations[language])
					.map(key => ({
						text: translations[language][key],
						regexp: new RegExp(`(?<=<dd>${key}<\\/dd.*?<dt>${language}<\\/dt>.*?<dd>).*?(?=<\\/dd>)`, 's')
					}))
					.reduce((innerMsg, translation) => innerMsg.replace(translation.regexp, translation.text), outerMsg),
			messages
		);
	}

	private static getTranslations(basePath: string): Record<string, string> {
		return readdirSync(basePath)
			.map(fileName => ({
				translations: CopyErrorMessages.getValidationTranslations(path.join(basePath, fileName)),
				lang: /oblique-(?<lang>[a-z]{2})\.json/.exec(fileName)?.groups?.lang?.toUpperCase()
			}))
			.reduce((translations, current) => ({...translations, [current.lang]: current.translations}), {});
	}

	private static getValidationTranslations(filePath: string): Record<string, string> {
		return readFileSync(filePath)
			.toString()
			.split('\n')
			.filter(line => line.indexOf('"i18n.validation') > 0)
			.map(line => /\s+"(?<key>.*?)"\s?:\s?"(?<value>.*)",?/.exec(line))
			.map(matcher => ({
				key: matcher?.groups?.key,
				value: matcher?.groups?.value.replace(/{{/g, '&lcub;&lcub;').replace(/\\"/g, '"')
			}))
			.reduce((translations, line) => ({...translations, [line.key]: line.value}), {});
	}
}

CopyErrorMessages.perform();
