import {readFileSync, writeFileSync} from 'fs';
import path from 'path';

type Json = Record<string, any>;
export class AdaptPackageJson {
	static perform(): void {
		const filePath = path.join('dist', 'oblique', 'package.json');
		const distPackage = AdaptPackageJson.getDistPackage(filePath);
		let adaptedDistPackage = AdaptPackageJson.removeExports(distPackage);
		adaptedDistPackage = AdaptPackageJson.addProperties(adaptedDistPackage);

		writeFileSync(filePath, JSON.stringify(adaptedDistPackage, null, 2));
	}

	private static getDistPackage(filePath: string): Json {
		return JSON.parse(readFileSync(filePath).toString());
	}

	private static removeExports(distPackage: Json): Json {
		delete distPackage.exports;
		return distPackage;
	}

	private static addProperties(distPackage: Json): Json {
		const rootPackage = JSON.parse(readFileSync('package.json').toString());
		['version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs', 'publishConfig'].forEach(
			field => (distPackage[field] = rootPackage[field])
		);

		return distPackage;
	}
}
