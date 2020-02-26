import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ObSelectableService {
	collectionChange$: Observable<ObISelectableCollectionChanged>;
	private readonly collections: Map<string, any[]> = new Map<string, any[]>();
	private readonly trigger: Subject<ObISelectableCollectionChanged> = new Subject();

	constructor() {
		this.collectionChange$ = this.trigger.asObservable();
	}

	toggleValue(value: any, collection: string): void {
		const foundCollection = this.collections.get(collection);
		if (!foundCollection || !foundCollection.includes(value)) {
			this.addValue(value, collection);
		} else {
			this.removeValue(value, collection);
		}
	}

	addValue(value: any, collection: string): void {
		if (!this.collections.has(collection)) {
			this.collections.set(collection, [value]);
			this.trigger.next({collection: collection, value: [value], eventType: 'CREATE'});
			return;
		}
		const foundCollection = this.collections.get(collection);
		if (!foundCollection.includes(value)) {
			foundCollection.push(value);
			this.trigger.next({collection: collection, value: foundCollection, eventType: 'UPDATE'});
		}
	}

	removeValue(value: any, collection: string): void {
		const foundCollection = this.collections.get(collection);
		if (foundCollection) {
			foundCollection.splice(foundCollection.findIndex(v => v === value), 1);
			this.trigger.next({collection: collection, value: foundCollection, eventType: 'UPDATE'});
		}
	}

	getCollection(collection: string): any[] | undefined {
		return this.collections.get(collection);
	}

	getCollections(): Map<string, any[]> {
		return this.collections;
	}

	removeCollection(collection: string): void {
		if (this.collections.has(collection)) {
			this.collections.delete(collection);
			this.trigger.next({collection: collection, eventType: 'DESTROY'});
		}
	}

	clearCollection(collection: string): void {
		if (this.collections.has(collection)) {
			this.collections.set(collection, []);
			this.trigger.next({collection: collection, value: [], eventType: 'UPDATE'});
		}
	}

	clearCollections(): void {
		this.collections.clear();
		this.trigger.next({eventType: 'DESTROY'});
	}
}

export interface ObISelectableCollectionChanged {
	collection?: string;
	value?: any[];
	eventType: 'CREATE' | 'UPDATE' | 'DESTROY';
}
