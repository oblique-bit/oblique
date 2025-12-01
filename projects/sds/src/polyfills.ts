declare global {
	interface ObjectConstructor {
		groupBy: <K extends PropertyKey, T>(
			items: Iterable<T>,
			callbackFn: (item: T, index: number) => K
		) => Partial<Record<K, T[]>>;
	}
}

/**
 * The groupBy function groups the elements of a given iterable according to
 * the string values returned by a provided callback function. The returned object
 * has separate properties for each group, containing arrays with the elements
 * in the group.
 *
 * @param items An iterable (such as an Array) whose elements will be grouped.
 * @param callbackFn A function to execute for each element in the iterable.
 * It should return a value that can get coerced into a property key indicating the
 * group of the current element.
 * @returns A object with properties for all groups, each assigned to an array containing
 * the elements of the associated group.
 */

if (typeof Object.groupBy === 'undefined') {
	Object.defineProperty(Object, 'groupBy', {
		value: <K extends PropertyKey, T>(items: T[], callbackFn: (item: T, index: number) => K): Record<K, T[]> => {
			const result = {} as Record<K, T[]>;
			let index = 0;
			items.forEach(item => {
				const label = callbackFn(item, index++);
				if (typeof result[label] === 'undefined') {
					result[label] = [];
				}
				(result[label] as T[]).push(item);
			});
			return result;
		},
		writable: true,
		configurable: true,
	});
}

export {};
