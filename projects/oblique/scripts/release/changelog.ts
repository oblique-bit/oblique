import {createWriteStream, readFileSync, writeFileSync} from 'fs';

export class Changelog {
	// conventionalChangelog is not available as an ESM module therefore it has to be imported with require and not with import
	private static readonly conventionalChangelog = require('conventional-changelog');

	static perform(): void {
		const changelog: string = readFileSync('CHANGELOG.md').toString();
		const stream = createWriteStream('CHANGELOG.md');
		stream.on('finish', () => {
			const newLog: string = readFileSync('CHANGELOG.md')
				.toString()
				.replace(Changelog.getLinesWithNonObliquePrefix(), '')
				.replace(Changelog.getObliquePrefix(), '')
				.replace(/##(?<title>.*)\n/g, '#$<title>')
				.replace(/\n\n\n/g, '\n\n');
			writeFileSync('CHANGELOG.md', newLog + changelog);
		});
		Changelog.conventionalChangelog({
			preset: 'angular',
			tagPrefix: ''
		}).pipe(stream);
	}

	private static getLinesWithNonObliquePrefix(): RegExp {
		return /^[-*] \*{2}(?!oblique)[a-z-]+\/[a-z-]+:\*{2}.*$\n/g;
	}

	private static getObliquePrefix(): RegExp {
		return /(?<=[-*] \*{2})oblique\/(?=[a-z-]+:\*{2})/g;
	}
}
