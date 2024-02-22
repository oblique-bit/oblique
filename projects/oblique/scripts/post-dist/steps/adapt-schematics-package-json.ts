import path from 'path';
import {PackageJson} from './package-json';

export class AdaptSchematicsPackageJson {
	static perform(): void {
		const filePath = path.join('..', '..', 'dist', 'oblique', 'schematics', 'package.json');
		const distPackage = PackageJson.filterOut(filePath, ['scripts']);
		const rootPackage = PackageJson.filterIn(path.join('..', '..', 'package.json'), ['version', 'author', 'contributors', 'license']);
		PackageJson.write(filePath, {...distPackage, ...rootPackage});
	}
}
