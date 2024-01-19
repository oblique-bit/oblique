import {Injectable} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockIconService {
	registerOnAppInit(): void {}

	registerIconSetsAsync(...urls: string[]): void {}

	registerIconSets(...iconSets: string[]): void {}

	registerIconsAsync(...icons: {name: string; url: string}[]): void {}

	registerIcons(...icons: {name: string; svg: string}[]): void {}
}
