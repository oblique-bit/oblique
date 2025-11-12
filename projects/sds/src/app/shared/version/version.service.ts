import {Injectable} from '@angular/core';
import type {Version} from '../../cms/models/version.model';

@Injectable({
	providedIn: 'root',
})
export class VersionService {
	private cmsVersion: Version[];
	private currentVersion: number;

	setCmsData(data: Version[]): void {
		this.cmsVersion = data;
	}

	setCurrentVersion(version: number): void {
		this.currentVersion = version;
	}

	getBaseUrl(): string {
		return this.cmsVersion?.find(item => item.version_number === this.currentVersion)?.base_url ?? '';
	}
}
