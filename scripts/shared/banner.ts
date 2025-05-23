import {EOL} from 'os';
import {version as currentVersion} from './../../package.json';
import {StaticScript} from './static-script';
import {Git} from './git';
import {Log} from './log';
import {Files} from './files';

export class Banner extends StaticScript {
	// manually set for versions with prolonged support
	private static readonly eolDates = {
		'10.0.0': '2024-06-30'
	};

	static addToFilesInProject(projectName: string): void {
		Log.info('Add a banner in all css, js and mjs files of the distribution');
		const banner = Banner.prepareBanner(currentVersion);

		Files.list(`../../dist/${projectName}`)
			.filter(filePath => /\.(?:m?js|css)$/.test(filePath))
			.map(filePath => ({filePath, content: Files.read(filePath)}))
			.filter(({content}) => !content.includes(banner))
			.map(file => ({...file, content: Banner.addBannerToFileContent(file.content, banner)}))
			.forEach(({filePath, content}) => Files.write(filePath, content));
	}

	private static addBannerToFileContent(content: string, banner: string): string {
		const shebangRegex = /(?<shebang>^#!.*)/;
		const shebangMatch = shebangRegex.exec(content);
		return shebangMatch?.groups?.shebang
			? Banner.insertAfterTarget(content, banner, shebangMatch.groups.shebang)
			: `${banner}${EOL}${content}`;
	}

	private static insertAfterTarget(content: string, toInsert: string, target: string): string {
		return content.replace(target, `${target}${EOL}${EOL}${toInsert}${EOL}`);
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
		return Git.doTagExist(tag) ? Git.getTagDate(tag) : Banner.getTodayDate();
	}
}
