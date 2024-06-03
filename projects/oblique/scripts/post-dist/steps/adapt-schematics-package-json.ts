import {PackageJson} from '../../../../../scripts/shared/package-json';

export class AdaptSchematicsPackageJson {
	static perform(): void {
		PackageJson.initialize('oblique', 'schematics')
			.addFieldsFromRoot('version', 'author', 'contributors', 'license')
			.removeScripts()
			.write();
	}
}
