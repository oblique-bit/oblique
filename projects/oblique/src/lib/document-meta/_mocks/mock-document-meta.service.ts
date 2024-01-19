import {Injectable} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockDocumentMetaService {
	titleSeparator = ' · ';
	titleSuffix = '';
	description = '';

	setTitle(title: string, separator: string = this.titleSeparator, suffix: string = this.titleSuffix): void {}

	getMetaDescription(): string {
		return '';
	}

	setDescription(description: string): void {}
}
