import {TestBed} from '@angular/core/testing';
import {ObSelectableService} from 'oblique';
import {ObISelectableCollectionChanged} from './selectable.service';

describe('SelectedService', () => {
	let selectableService: ObSelectableService;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [],
			providers: [
				ObSelectableService
			]
		});
		selectableService = TestBed.get(ObSelectableService);
	});

	it('should be created', () => {
		expect(selectableService).toBeTruthy();
	});

	it('should have no collections after initialzation', () => {
		expect(selectableService['collections']).not.toBeUndefined();
		expect(selectableService.getCollections().size).toBe(0);
	});

	it('should add new value to a collection', () => {
		expect(selectableService.getCollections().size).toBe(0);
		selectableService.addValue('important-value', 'business');
		expect(selectableService.getCollections().size).toBe(1);
		expect(selectableService.getCollection('business')[0]).toBe('important-value');
		selectableService.addValue('not-relevant-value', 'business');
		expect(selectableService.getCollections().size).toBe(1);
		expect(selectableService.getCollection('business')[0]).toBe('important-value');
		expect(selectableService.getCollection('business')[1]).toBe('not-relevant-value');
	});

	it('should remove value from collection', () => {
		expect(selectableService.getCollections().size).toBe(0);
		selectableService.addValue('important-value', 'government');
		expect(selectableService.getCollections().size).toBe(1);
		expect(selectableService.getCollection('government').length).toBe(1);
		selectableService.toggleValue('important-value', 'government');
		expect(selectableService.getCollections().size).toBe(1);
		expect(selectableService.getCollection('government').length).toBe(0);
		selectableService.addValue('important-1', 'government');
		selectableService.addValue('important-2', 'government');
		selectableService.addValue('important-3', 'government');
		selectableService.addValue('important-4', 'government');
		selectableService.addValue('important-5', 'government');
		expect(selectableService.getCollection('government').length).toBe(5);
		selectableService.removeValue('important-1', 'government');
		expect(selectableService.getCollection('government').length).toBe(4);
		selectableService.removeValue('important-2', 'government');
		expect(selectableService.getCollection('government').length).toBe(3);
		selectableService.removeValue('important-3', 'government');
		expect(selectableService.getCollection('government').length).toBe(2);
		selectableService.removeValue('important-4', 'government');
		expect(selectableService.getCollection('government').length).toBe(1);
		selectableService.removeValue('important-5', 'government');
		expect(selectableService.getCollection('government').length).toBe(0);
	});

	it('should toggle value', () => {
		selectableService.addValue('something', 'angular');
		expect(selectableService.getCollections().size).toBe(1);
		expect(selectableService.getCollection('angular').length).toBe(1);
		selectableService.toggleValue('something', 'angular');
		expect(selectableService.getCollections().size).toBe(1);
		expect(selectableService.getCollection('angular').length).toBe(0);
		selectableService.addValue('something', 'angular');
		expect(selectableService.getCollections().size).toBe(1);
		expect(selectableService.getCollection('angular').length).toBe(1);
		selectableService.toggleValue('something', 'angular');
		expect(selectableService.getCollections().size).toBe(1);
		expect(selectableService.getCollection('angular').length).toBe(0);
	});

	it('should return a collection', () => {
		expect(selectableService.getCollections().size).toBe(0);
		selectableService.addValue('value-1', 'collection-A');
		expect(selectableService.getCollections().size).toBe(1);
		selectableService.addValue('value-2', 'collection-A');
		expect(selectableService.getCollections().size).toBe(1);
		selectableService.addValue('value-3', 'collection-B');
		expect(selectableService.getCollections().size).toBe(2);
		selectableService.addValue('value-4', 'collection-C');
		expect(selectableService.getCollections().size).toBe(3);
		selectableService.addValue('value-5', 'collection-C');
		expect(selectableService.getCollections().size).toBe(3);
		selectableService.addValue('value-6', 'collection-C');
		expect(selectableService.getCollections().size).toBe(3);
		selectableService.addValue('value-7', 'collection-D');
		expect(selectableService.getCollections().size).toBe(4);

		expect(selectableService.getCollection('collection-A')).toContain('value-1');
		expect(selectableService.getCollection('collection-A')).toContain('value-2');
		expect(selectableService.getCollection('collection-A')).not.toContain('value-3');
		expect(selectableService.getCollection('collection-B')).toContain('value-3');

		selectableService.toggleValue('value-3', 'collection-B');
		expect(selectableService.getCollection('collection-B')).not.toContain('value-3');
		selectableService.toggleValue('value-3', 'collection-B');
		expect(selectableService.getCollection('collection-B')).toContain('value-3');

		expect(selectableService.getCollection('collection-B')).not.toContain('value-4');
		expect(selectableService.getCollection('collection-C')).toContain('value-4');
		expect(selectableService.getCollection('collection-C')).toContain('value-5');
		expect(selectableService.getCollection('collection-C')).toContain('value-6');
		expect(selectableService.getCollection('collection-C').length).toBe(3);
	});

	it('should return all collections', () => {
		expect(selectableService.getCollections().size).toBe(0);
		selectableService.addValue(Math.random(), 'A');
		selectableService.addValue(Math.random(), 'B');
		selectableService.addValue(Math.random(), 'C');
		selectableService.addValue(Math.random(), 'D');
		selectableService.addValue(Math.random(), 'E');
		selectableService.addValue(Math.random(), 'F');
		expect(selectableService.getCollections().size).toBe(6);
		const collections = selectableService.getCollections();
		expect(collections.get('A')).toBeDefined();
		expect(collections.get('B')).toBeDefined();
		expect(collections.get('C')).toBeDefined();
		expect(collections.get('D')).toBeDefined();
		expect(collections.get('E')).toBeDefined();
		expect(collections.get('F')).toBeDefined();
		expect(collections.get('G')).not.toBeDefined();
	});

	it('should remove collection', () => {
		expect(selectableService.getCollections().size).toBe(0);
		selectableService.addValue(Math.random(), 'A');
		selectableService.addValue(Math.random(), 'B');
		selectableService.addValue(Math.random(), 'C');
		selectableService.addValue(Math.random(), 'D');
		selectableService.addValue(Math.random(), 'E');
		selectableService.addValue(Math.random(), 'F');
		expect(selectableService.getCollections().size).toBe(6);
		selectableService.removeCollection('A');
		expect(selectableService.getCollections().size).toBe(5);
		selectableService.removeCollection('B');
		expect(selectableService.getCollections().size).toBe(4);
		selectableService.removeCollection('C');
		expect(selectableService.getCollections().size).toBe(3);
		selectableService.removeCollection('D');
		expect(selectableService.getCollections().size).toBe(2);
		selectableService.removeCollection('E');
		expect(selectableService.getCollections().size).toBe(1);
		selectableService.removeCollection('F');
		expect(selectableService.getCollections().size).toBe(0);
	});

	it('should clear collection', () => {
		selectableService.addValue('department-1', 'default');
		selectableService.addValue('department-2', 'default');
		selectableService.addValue('department-3', 'default');
		selectableService.addValue('department-4', 'default');
		expect(selectableService.getCollection('default').length).toBe(4);
		selectableService.addValue('department-1', 'special');
		selectableService.addValue('department-2', 'special');
		selectableService.addValue('department-3', 'special');
		selectableService.addValue('department-4', 'special');
		expect(selectableService.getCollection('special').length).toBe(4);
		selectableService.clearCollection('default');
		expect(selectableService.getCollection('default').length).toBe(0);
		expect(selectableService.getCollection('special').length).toBe(4);
		selectableService.clearCollection('special');
		expect(selectableService.getCollection('default').length).toBe(0);
		expect(selectableService.getCollection('special').length).toBe(0);
	});

	it('should clear collections', () => {
		selectableService.addValue(Math.random(), 'vegetables');
		selectableService.addValue(Math.random(), 'fish');
		selectableService.addValue(Math.random(), 'meat');
		selectableService.addValue(Math.random(), 'cars');
		selectableService.addValue(Math.random(), 'people');
		selectableService.addValue(Math.random(), 'default');
		expect(selectableService.getCollections().size).toBe(6);
		selectableService.clearCollections();
		expect(selectableService.getCollections().size).toBe(0);
		selectableService.addValue(Math.random(), 'broccoli');
		expect(selectableService.getCollections().size).toBe(1);
		selectableService.clearCollections();
		expect(selectableService.getCollections().size).toBe(0);

	});

	it('should emit CREATE when collections is created', (done) => {
		selectableService.collectionChange$.subscribe((wrapper: ObISelectableCollectionChanged) => {
			expect(wrapper.collection).toBe('meteorolgy');
			expect(wrapper.value[0]).toBe('weather');
			expect(wrapper.eventType).toBe('CREATE');
			done();
		});
		selectableService.addValue('weather', 'meteorolgy');
	});

	it('should emit UPDATE when values being added', (done) => {
		selectableService.addValue('weather', 'meteorolgy');
		selectableService.addValue('rain', 'meteorolgy');
		selectableService.collectionChange$.subscribe((wrapper: ObISelectableCollectionChanged) => {
			expect(wrapper.collection).toBe('meteorolgy');
			expect(wrapper.value[2]).toBe('sun');
			expect(wrapper.eventType).toBe('UPDATE');
			done();
		});
		selectableService.addValue('sun', 'meteorolgy');
	});

	it('should emit UPDATE when collections changes', (done) => {
		selectableService.addValue('weather', 'meteorolgy');
		selectableService.addValue('rain', 'meteorolgy');
		selectableService.collectionChange$.subscribe((wrapper: ObISelectableCollectionChanged) => {
			expect(wrapper.collection).toBe('meteorolgy');
			expect(wrapper.value[1]).toBeUndefined();
			expect(wrapper.eventType).toBe('UPDATE');
			done();
		});
		selectableService.removeValue('rain', 'meteorolgy');
	});

	it('should emit DESTROY when collections is being destroyed', (done) => {
		selectableService.addValue('star', 'astronomy');
		selectableService.addValue('earth', 'astronomy');
		selectableService.collectionChange$.subscribe((wrapper: ObISelectableCollectionChanged) => {
			expect(wrapper.collection).toBe('astronomy');
			expect(wrapper.eventType).toBe('DESTROY');
			done();
		});
		selectableService.removeCollection('astronomy');
	});
});
