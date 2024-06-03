import {readFileSync, renameSync, writeFileSync} from 'fs';
import path from 'path';
import {listFiles} from '../../../../../scripts/shared/utils';

export class RenameDistribution {
	private static readonly searchValue = 'oblique-oblique';
	private static readonly replaceValue = 'oblique';
	private static readonly directory = path.join('..', '..', 'dist');

	static perform(): void {
		// Please note that order is important!
		const fileList = listFiles(RenameDistribution.directory);
		RenameDistribution.renameInFiles(fileList, RenameDistribution.searchValue, RenameDistribution.replaceValue);
		RenameDistribution.renameFiles(fileList, RenameDistribution.searchValue, RenameDistribution.replaceValue);
	}

	private static renameFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		fileList
			.filter(filePath => filePath.includes(searchValue))
			.forEach(filePath => renameSync(filePath, filePath.replace(searchValue, replaceValue)));
	}

	private static renameInFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		fileList
			.filter(filePath => !filePath.includes(`CHANGELOG.md`))
			.map(filePath => ({file: readFileSync(filePath).toString(), filePath}))
			.filter(fileObject => fileObject.file.includes(searchValue))
			.forEach(fileObject => writeFileSync(fileObject.filePath, fileObject.file.replace(new RegExp(searchValue, `g`), replaceValue)));
	}
}
