import {readFileSync, writeFileSync} from 'fs';
import path from 'path';

type Json = Record<string, any>;
export class AdaptSchematicsPackageJson {
	static perform(): void {
		const filePath = path.join('..', '..', 'dist', 'oblique', 'schematics', 'package.json');
		const distPackage = AdaptSchematicsPackageJson.filter(filePath, ([key]) => key !== 'scripts');
		const rootPackage = AdaptSchematicsPackageJson.getAdaptedRootPackage();

		writeFileSync(filePath, JSON.stringify({...distPackage, ...rootPackage}, null, 2));
	}

	private static getAdaptedRootPackage(): Json {
		const filePath = path.join('..', '..', 'package.json');
		const fields = ['version', 'author', 'contributors', 'license'];
		return AdaptSchematicsPackageJson.filter(filePath, ([key]) => fields.includes(key));
	}

	private static filter(filePath: string, func: (string) => boolean): Json {
		return Object.fromEntries(Object.entries(AdaptSchematicsPackageJson.getData(filePath)).filter(func));
	}

	private static getData(filePath: string): Json {
		return JSON.parse(readFileSync(filePath).toString());
	}
}
