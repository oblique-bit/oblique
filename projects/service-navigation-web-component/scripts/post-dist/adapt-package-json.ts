import {PackageJson} from '../../../../scripts/shared/package-json';

export class AdaptPackageJson {
	static perform(): void {
		PackageJson.initialize('service-navigation-web-component')
			.addFieldsFromRoot('version', 'author', 'contributors', 'license')
			.removeDependencies('devDependencies', '@angular/elements')
			.write()
			.finalize();
	}
}
