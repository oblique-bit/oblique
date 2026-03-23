export function getScrollIntoViewDelta(container: Element, item: HTMLElement): number {
	const {itemLeft, itemRight} = getItemOffsets(item);
	const {containerLeft, containerRight} = getContainerOffsets(container);

	if (itemLeft < containerLeft) {
		return itemLeft - containerLeft;
	}
	if (itemRight > containerRight) {
		return itemRight - containerRight;
	}
	return 0;
}

function getItemOffsets(item: Element): {itemLeft: number; itemRight: number} {
	const {left, right} = item.getBoundingClientRect();
	return {
		itemLeft: left,
		itemRight: right,
	};
}

function getContainerOffsets(container: Element): {containerLeft: number; containerRight: number} {
	const {paddingLeft, paddingRight} = getComputedStyle(container);
	const {left, right} = container.getBoundingClientRect();
	return {
		containerLeft: left + parseFloat(paddingLeft),
		containerRight: right - parseFloat(paddingRight),
	};
}
