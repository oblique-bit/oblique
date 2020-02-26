import {Injectable} from '@angular/core';
import {of} from 'rxjs';

@Injectable()
export class ObMockSelectableService {
	collectionChange$ = of({});

	toggleValue(value: any, collection: string): void {
	}

	addValue(value: any, collection: string): void {
	}

	removeValue(value: any, collection: string): void {
	}

	getCollection(collection: string): any[] {
		return [];
	}

	getCollections(): Map<string, any[]> {
		return new Map<string, any[]>();
	}

	removeCollection(collection: string): void {
	}

	clearCollection(collection: string): void {
	}

	clearCollections(): void {
	}
}
