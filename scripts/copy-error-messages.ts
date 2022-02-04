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
			(outerMsg, lang) =>
				Object.keys(translations[lang]).reduce(
					(innerMsg, key) => innerMsg.replace(new RegExp(`(?<=<dd>${key}<\\/dd.*?<dt>${lang}<\\/dt>.*?<dd>).*?(?=<\\/dd>)`, 's'), translations[lang][key]),
					outerMsg
				),
			messages
		);
	}

	private static getTranslations(basePath: string): Record<string, string> {
		const translations = {};
		readdirSync(basePath).forEach(file => {
			const lang = /oblique-(?<lang>[a-z]{2})\.json/.exec(file)?.groups?.lang?.toUpperCase();
			translations[lang] = readFileSync(path.join(basePath, file))
				.toString()
				.split('\n')
				.filter(line => line.indexOf('"i18n.validation') > 0)
				.map(line => /\s+"(?<key>.*?)"\s?:\s?"(?<value>.*)",?/.exec(line))
				.map(matcher => ({
					key: matcher?.groups?.key,
					value: matcher?.groups?.value.replace(/{{/g, '&lcub;&lcub;').replace(/\\"/g, '"')
				}))
				.reduce((object, line) => ({...object, [line.key]: line.value}), {});
		});
		return translations;
	}
}

CopyErrorMessages.perform();
