import './polyfills';

interface Item {
	name: string;
	type: string;
	quantity: number;
}

describe('groupBy()', () => {
	it('groups items that need to be restocked if the quantity is less than 10', () => {
		const inventory: Item[] = [
			{name: 'asparagus', type: 'vegetables', quantity: 9},
			{name: 'bananas', type: 'fruit', quantity: 5},
			{name: 'goat', type: 'meat', quantity: 23},
			{name: 'cherries', type: 'fruit', quantity: 12},
			{name: 'fish', type: 'meat', quantity: 22},
		];

		const result = Object.groupBy(inventory, ({quantity}) => (quantity < 10 ? 'restock' : 'sufficient')) as {
			restock: Item[];
			sufficient: Item[];
		};

		expect(result).toEqual({
			restock: [
				{name: 'asparagus', type: 'vegetables', quantity: 9},
				{name: 'bananas', type: 'fruit', quantity: 5},
			],
			sufficient: [
				{name: 'goat', type: 'meat', quantity: 23},
				{name: 'cherries', type: 'fruit', quantity: 12},
				{name: 'fish', type: 'meat', quantity: 22},
			],
		});
	});
});
