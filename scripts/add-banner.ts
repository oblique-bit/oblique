import {readFileSync, readdirSync, statSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
import {version as currentVersion} from './../package.json';
import path from 'path';

class AddBanner {
	private static readonly directory = 'dist';

	static perform(): void {
		const header = AddBanner.prepareHeader(currentVersion);
		AddBanner.listFiles(AddBanner.directory)
			.filter(filePath => /\.(?:m?js|css)$/.test(filePath))
			.map(filePath => ({path: filePath, content: readFileSync(filePath).toString()}))
			.forEach(file => writeFileSync(file.path, `${header}\n${file.content}`));
	}

	private static listFiles(directory: string): string[] {
		return readdirSync(directory)
			.map(fileName => path.join(directory, fileName))
			.reduce(
				(filePaths, filePath) =>
					statSync(filePath).isDirectory() ? [...filePaths, ...AddBanner.listFiles(filePath)] : [...filePaths, filePath],
				[]
			);
	}

	private static prepareHeader(version: string): string {
		const releaseDate = AddBanner.getTodayDate();
		const endOfLifeDate = AddBanner.getEndOfLifeDate(`${version.split('.')[0]}.0.0`);
		return `/**
* @file Oblique, The front-end framework for your Swiss branded UI.
* @copyright 2020 - ${new Date().getFullYear()} Federal Office of Information Technology, Systems and Telecommunication FOITT {@link http://www.bit.admin.ch}
* @version ${version} (released on ${releaseDate}, supported at least until ${endOfLifeDate})
* @author Oblique team, FOITT, BS-BSC-EN4 <oblique@bit.admin.ch>
* @license MIT {@link https://oblique.bit.admin.ch/license}
* @see http://oblique.bit.oblique.ch
*/
`;
	}

	private static getEndOfLifeDate(version): string {
		const versionReleaseDate = AddBanner.getTagDate(version);
		const endOfLifeDate = new Date(versionReleaseDate);

		endOfLifeDate.setFullYear(endOfLifeDate.getFullYear() + 1, endOfLifeDate.getMonth() + 1, 0);
		return endOfLifeDate.toISOString().split('T')[0];
	}

	private static getTagDate(tag: string): string {
		return execSync(`git tag -l '${tag}'`).toString()
			? execSync(`git show -s --format=%ci ${tag}`).toString().split(' ')[0]
			: AddBanner.getTodayDate();
	}

	private static getTodayDate(): string {
		return new Date().toISOString().split('T')[0];
	}
}

AddBanner.perform();
