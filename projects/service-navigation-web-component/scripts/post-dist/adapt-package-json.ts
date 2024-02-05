import path from 'path';
import {PackageJson} from './package-json';

export class AdaptPackageJson {
	private static readonly DIST_PATH = path.join('..', '..', 'dist', 'service-navigation-web-component');

	static perform(): void {
		const filePath = path.join(AdaptPackageJson.DIST_PATH, 'package.json');
		const fields = ['version', 'author', 'contributors', 'license'];
		const distPackage = PackageJson.getData(filePath);
		const rootPackage = PackageJson.filterIn(path.join('..', '..', 'package.json'), fields);
		PackageJson.write(filePath, {
			...distPackage,
			...rootPackage
		});
	}
}
