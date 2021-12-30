class CopyErrorMessages {
	private static readonly fs = require('fs');
	private static readonly path = require('path');

	static perform(): void {
		const basePath = CopyErrorMessages.path.join('projects', 'oblique', 'src', 'assets', 'i18n');
		const messagePath = CopyErrorMessages.path.join('projects', 'oblique', 'src', 'lib', 'error-messages', 'error-messages.description.html');
		CopyErrorMessages.fs.writeFileSync(
			messagePath,
			CopyErrorMessages.adaptMessages(CopyErrorMessages.getTranslations(basePath), CopyErrorMessages.fs.readFileSync(messagePath).toString())
		);
	}

	private static adaptMessages(translations: {[key: string]: string}, messages: string): string {
		return Object.keys(translations).reduce(
			(outerMsg, lang) =>
				Object.keys(translations[lang]).reduce(
					(innerMsg, key) => innerMsg.replace(new RegExp(`(?<=<dd>${key}<\\/dd.*?<dt>${lang}<\\/dt>.*?<dd>).*?(?=<\\/dd>)`, 's'), translations[lang][key]),
					outerMsg
				),
			messages
		);
	}

	private static getTranslations(basePath: string): {[key: string]: string} {
		const translations = {};
		CopyErrorMessages.fs.readdirSync(basePath).forEach(file => {
			const lang = /oblique-(?<lang>[a-z]{2})\.json/.exec(file)?.groups?.lang?.toUpperCase();
			translations[lang] = CopyErrorMessages.fs
				.readFileSync(CopyErrorMessages.path.join(basePath, file))
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
