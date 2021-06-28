/* eslint-disable */

const fs = require('fs'),
	path = require('path');

const basePath = path.join('projects', 'oblique', 'src', 'assets', 'i18n');
const messagePath = path.join('projects', 'oblique', 'src', 'lib', 'error-messages', 'error-messages.description.html');
fs.writeFileSync(messagePath, adaptMessages(getTranslations(basePath), fs.readFileSync(messagePath).toString()));

function adaptMessages(translations, messages) {
	return Object.keys(translations).reduce((outerMsg, lang) =>
		Object.keys(translations[lang]).reduce((innerMsg, key) =>
			innerMsg.replace(new RegExp(`(?<=<dd>${key}<\\/dd.*?<dt>${lang}<\\/dt>.*?<dd>).*?(?=<\\/dd>)`, 's'), translations[lang][key]),
			outerMsg
		),
		messages
	);
}

function getTranslations(basePath) {
	const translations = {};
	fs.readdirSync(basePath).forEach(file => {
		const lang = /oblique-(?<lang>[a-z]{2})\.json/.exec(file).groups.lang.toUpperCase();
		translations[lang] = fs.readFileSync(path.join(basePath, file))
			.toString()
			.split('\n')
			.filter(line => line.indexOf('"i18n.validation') > 0)
			.map(line => /\s+"(?<key>.*?)"\s?:\s?"(?<value>.*)",?/.exec(line))
			.map(matcher => ({
				key: matcher?.groups?.key,
				value: matcher?.groups?.value
					.replace(/{{/g, '&lcub;&lcub;')
					.replace(/\\"/g, '"')
			}))
			.reduce((object, line) => ({...object, [line.key]: line.value}), {});
	});
	return translations;
}
