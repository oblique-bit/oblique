import path from 'path';
import {PackageJson} from './package-json';

export class AdaptPackageJson {
	static perform(): void {
		const filePath = path.join('..', '..', 'dist', 'oblique', 'package.json');
		const fields = ['version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs'];
		const distPackage = PackageJson.getData(filePath);
		const rootPackage = PackageJson.filterIn(path.join('..', '..', 'package.json'), fields);
		PackageJson.write(filePath, {...distPackage, ...rootPackage, exports: {...distPackage.exports, './*': {default: './*'}}});
	}
}
