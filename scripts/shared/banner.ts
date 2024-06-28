import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {EOL} from 'os';
import {version as currentVersion} from './../../package.json';
import {getResultFromCommand, listFiles} from './utils';
import {StaticScript} from './static-script';

export class Banner extends StaticScript {
	// manually set for versions with prolonged support
	private static readonly eolDates = {
		'10.0.0': '2024-06-30' // eslint-disable-line @typescript-eslint/naming-convention
	};

	static addToFilesInProject(projectName: string): void {
		const banner = Banner.prepareBanner(currentVersion);

		listFiles(path.join('..', '..', 'dist', projectName))
			.filter(filePath => /\.(?:m?js|css)$/.test(filePath))
			.map(filePath => ({filePath, content: readFileSync(filePath).toString()}))
			.forEach(({filePath, content}) => writeFileSync(filePath, `${banner}${EOL}${content}`));
	}

	private static prepareBanner(version: string): string {
		const releaseDate = Banner.getTodayDate();
		const majorVersion = `${version.split('.')[0]}.0.0`;
		const endOfLifeDate = (Banner.eolDates[majorVersion] as string) ?? Banner.getEndOfLifeDate(majorVersion);
		return `/**
* @file Oblique, The front-end framework for your Swiss branded UI.
* @copyright 2020 - ${new Date().getFullYear()} Federal Office of Information Technology, Systems and Telecommunication FOITT {@link https://www.bit.admin.ch}
* @version ${version} (released on ${releaseDate}, supported at least until ${endOfLifeDate})
* @author Oblique team, FOITT, BS-BSC-EN4 <oblique@bit.admin.ch>
* @license MIT {@link https://github.com/oblique-bit/oblique/blob/master/LICENSE}
* @see https://oblique.bit.admin.ch
*/
`;
	}

	private static getTodayDate(): string {
		return new Date().toISOString().split('T')[0];
	}

	private static getEndOfLifeDate(version: string): string {
		const endOfLifeDate = new Date(Banner.getTagDate(version));
		endOfLifeDate.setFullYear(endOfLifeDate.getFullYear() + 1, endOfLifeDate.getMonth() + 1, 0);
		return endOfLifeDate.toISOString().split('T')[0];
	}

	private static getTagDate(tag: string): string {
		return getResultFromCommand(`git tag -l '${tag}'`)
			? getResultFromCommand(`git show -s --format=%ci ${tag}`).split(' ')[0]
			: Banner.getTodayDate();
	}
}
