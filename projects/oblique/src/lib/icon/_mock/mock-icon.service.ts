import {Injectable} from '@angular/core';

@Injectable()
export class ObMockIconService {
	registerOnAppInit(): void {}

	registerIconSetsAsync(...urls: string[]): void {}

	registerIconSets(...iconSets: string[]): void {}

	registerIconsAsync(...icons: {name: string; url: string}[]): void {}

	registerIcons(...icons: {name: string; svg: string}[]): void {}
}
