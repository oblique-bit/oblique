export function humanizeList(list: string[]): string {
	return list
		.map(item => `"${item}"`)
		.join(', ')
		.replace(/,(?<last>[^,]*)$/u, ' and$<last>');
}
