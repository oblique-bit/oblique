import {type DefaultTreeAdapterTypes, parse, parseFragment, serialize} from 'parse5';
type Document = DefaultTreeAdapterTypes.Document;
type DocumentFragment = DefaultTreeAdapterTypes.DocumentFragment;
type Element = DefaultTreeAdapterTypes.Element;
type Node = DefaultTreeAdapterTypes.Node;
type ParentNode = DefaultTreeAdapterTypes.ParentNode;

/**
 * Parses an HTML document, applies a transformation to its DOM tree,
 * and serializes the updated document back to HTML.
 *
 * The output is normalized. For example, self-closing tags are not preserved.
 *
 * Always returns a full HTML document, even if only a snippet was provided
 *
 * @param html - The HTML document to transform.
 * @param transformer - A callback that can inspect and modify the parsed document.
 * @returns The transformed HTML document.
 */
export function transformDocument(html: string, transformer: (document: Document) => void): string {
	const document = parse(html);
	transformer(document);
	return serialize(document);
}

/**
 * Parses an HTML fragment, applies a transformation to its DOM tree,
 * and serializes the updated snippet back to HTML.
 *
 * The output is normalized. For example, self-closing tags are not preserved.
 *
 * @param html - The HTML fragment to transform.
 * @param transformer - A callback that can inspect and modify the parsed fragment.
 * @returns The transformed HTML fragment.
 */
export function transformFragment(html: string, transformer: (document: DocumentFragment) => void): string {
	const document = parseFragment(html);
	transformer(document);
	return serialize(document);
}

/**
 * Finds the first element in the subtree rooted at the given node that
 * matches the provided predicate.
 *
 * @param node - The root node to search from.
 * @param tagOrMatcher - either a tagName or A predicate function used to identify the desired element.
 * @returns The first matching element, or `undefined` if none is found.
 */
export function findElement(
	node: Node | undefined,
	tagOrMatcher: string | ((element: Element) => boolean)
): Element | undefined {
	if (!node) {
		return;
	}
	const matcher = typeof tagOrMatcher === 'string' ? (el: Element) => el.tagName === tagOrMatcher : tagOrMatcher;

	if (isElement(node) && matcher(node)) {
		return node;
	}

	if (isParentNode(node)) {
		for (const child of node.childNodes) {
			const element = findElement(child, matcher);
			if (element) {
				return element;
			}
		}
	}
	return undefined;
}

/**
 * Returns the value of an attribute on an element.
 *
 * @param element - The element to inspect.
 * @param name - The attribute name.
 * @returns The attribute value, or `undefined` if the attribute does not exist.
 */
export function getAttribute(element: Element, name: string): string | undefined {
	return element.attrs.find(attr => attr.name === name)?.value;
}

/**
 * Sets the value of an attribute on an element.
 *
 * If the attribute already exists, its value is updated. Otherwise, a new
 * attribute is added to the element.
 *
 * @param element - The element to modify.
 * @param name - The attribute name.
 * @param value - The attribute value.
 */
export function setAttribute(element: Element, name: string, value: string): void {
	const attribute = element.attrs.find(attr => attr.name === name);
	if (attribute) {
		attribute.value = value;
	} else {
		element.attrs.push({name, value});
	}
}

function isElement(node: Node): node is Element {
	return 'tagName' in node;
}

function isParentNode(node: Node): node is ParentNode {
	return 'childNodes' in node;
}
