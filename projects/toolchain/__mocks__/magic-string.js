/*
 * AI GENERATED CODE
 * Model: GitHub Copilot
 * Prompt: Fix post-rebase Angular 22 Jest failures caused by MagicString
 * module-format incompatibility and preserve DevKit insertion behavior.
 */

/*
 * Angular DevKit's CommonJS recorder imports MagicString as a named export,
 * while magic-string@1 is ESM-only. Jest runs these toolchain tests through
 * ts-jest in CommonJS mode, so the real package cannot be loaded here.
 *
 * This mock implements only the recorder operations used by DevKit:
 * appendLeft, appendRight, remove, and toString. Keep the moduleNameMapper
 * entry in jest.config.js paired with this mock.
 *
 * Remove both this file and its mapper only after the toolchain tests run with
 * a Jest/transform setup that loads magic-string@1 as ESM, or after DevKit
 * provides a CommonJS-compatible import. Verify the complete toolchain suite
 * after removal; a passing filtered test run is not sufficient.
 */
class MagicString {
	constructor(original) {
		this.original = original;
		this.changes = [];
	}

	appendLeft(index, content) {
		this.changes.push({index, content, side: 'left'});
		return this;
	}

	appendRight(index, content) {
		this.changes.push({index, content, side: 'right'});
		return this;
	}

	remove(start, end) {
		this.changes.push({start, end});
		return this;
	}

	toString() {
		const insertions = this.changes
			.filter(change => 'index' in change)
			.sort((first, second) => {
				if (first.index !== second.index) {
					return first.index - second.index;
				}

				return first.side === 'left' ? -1 : 1;
			});

		let result = this.original;
		let offset = 0;

		for (const insertion of insertions) {
			const position = insertion.index + offset;
			result = `${result.slice(0, position)}${insertion.content}${result.slice(position)}`;
			offset += insertion.content.length;
		}

		for (const removal of this.changes.filter(change => 'start' in change)) {
			const start = removal.start + offset;
			const end = removal.end + offset;
			result = `${result.slice(0, start)}${result.slice(end)}`;
			offset -= removal.end - removal.start;
		}

		return result;
	}
}

module.exports = {MagicString};
