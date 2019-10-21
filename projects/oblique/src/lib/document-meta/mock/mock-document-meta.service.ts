import {Injectable} from '@angular/core';

@Injectable()
export class MockDocumentMetaService {
	titleSeparator = ' · ';
	titleSuffix = '';
	description = '';

	setTitle(title: string, separator: string = this.titleSeparator, suffix: string = this.titleSuffix): void {
	}

	getMetaDescription(): string {
		return '';
	}

	setDescription(description: string): void {
	}
}
