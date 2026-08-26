/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 8 read-only Angular template public API analysis
 */

import {
	CssSelector,
	type ParseError,
	SelectorMatcher,
	type TmplAstBoundAttribute,
	type TmplAstElement,
	type TmplAstNode,
	type TmplAstTemplate,
	type TmplAstTextAttribute,
	parseTemplate,
} from '@angular/compiler';
import type {ObliqueAngularTemplateApi} from '../sources/oblique/public-api.reader.js';

const obliqueElementPrefix = 'ob-';
const severityOrder: Record<ObliqueTemplateFindingSeverity, number> = {error: 0, warning: 1, info: 2};

export type ObliqueTemplateFindingRule =
	'OBLIQUE_DEPRECATED_TEMPLATE_API' | 'OBLIQUE_UNKNOWN_COMPONENT_SELECTOR' | 'TEMPLATE_SYNTAX_ERROR';
export type ObliqueTemplateFindingSeverity = 'error' | 'warning' | 'info';

export interface ObliqueTemplateLocation {
	line: number;
	column: number;
}

export interface ObliqueTemplateFinding {
	rule: ObliqueTemplateFindingRule;
	severity: ObliqueTemplateFindingSeverity;
	message: string;
	location: ObliqueTemplateLocation;
	selector?: string;
	symbol?: string;
	recommendation: string;
}

export interface ObliqueTemplateSummary {
	errors: number;
	warnings: number;
	info: number;
}

export interface ObliqueTemplateAnalysis {
	valid: boolean;
	summary: ObliqueTemplateSummary;
	findings: ObliqueTemplateFinding[];
}

export interface ObliqueTemplatePublicApiReader {
	getAngularTemplateApis: () => readonly ObliqueAngularTemplateApi[];
}

export interface AngularTemplateParseResult {
	nodes: readonly TmplAstNode[];
	errors: ParseError[] | null;
}

export type AngularTemplateParser = (code: string, fileName: string) => AngularTemplateParseResult;

interface PositionedFinding extends ObliqueTemplateFinding {
	position: number;
}

/** Parses submitted Angular template text in memory without resolving, compiling, or executing it. */
export class ObliqueTemplateAnalyzer {
	private readonly publicApiReader: ObliqueTemplatePublicApiReader;
	private readonly templateParser: AngularTemplateParser;

	constructor(publicApiReader: ObliqueTemplatePublicApiReader, templateParser: AngularTemplateParser = parseTemplate) {
		this.publicApiReader = publicApiReader;
		this.templateParser = templateParser;
	}

	analyze(code: string): ObliqueTemplateAnalysis {
		const parsedTemplate = this.templateParser(code, 'submitted.html');
		const syntaxFindings = getSyntaxFindings(code, parsedTemplate.errors);
		const findings =
			syntaxFindings.length === 0
				? getTemplateFindings(code, parsedTemplate.nodes, this.publicApiReader.getAngularTemplateApis())
				: syntaxFindings;
		const sortedFindings = findings.sort(compareFindings);
		const summary = getSummary(sortedFindings);
		return {valid: summary.errors === 0, summary, findings: sortedFindings.map(toFinding)};
	}
}

function getSyntaxFindings(code: string, errors: ParseError[] | null): PositionedFinding[] {
	if (errors === null) {
		return [];
	}
	const diagnosticKeys = new Set<string>();
	return errors.flatMap(error => {
		const position = error.span.start.offset;
		const diagnosticKey = [error.msg, position, error.span.end.offset].join('\u0000');
		if (diagnosticKeys.has(diagnosticKey)) {
			return [];
		}
		diagnosticKeys.add(diagnosticKey);
		return [
			createFinding(code, position, {
				rule: 'TEMPLATE_SYNTAX_ERROR',
				severity: 'error',
				message: error.msg,
				recommendation: 'Correct the Angular template syntax before checking Oblique template APIs.',
			}),
		];
	});
}

function getTemplateFindings(
	code: string,
	nodes: readonly TmplAstNode[],
	publicTemplateApis: readonly ObliqueAngularTemplateApi[]
): PositionedFinding[] {
	const matcher = createSelectorMatcher(publicTemplateApis);
	const componentSelectors = new Set(
		publicTemplateApis
			.filter(templateApi => templateApi.kind === 'component')
			.flatMap(templateApi => CssSelector.parse(templateApi.selector))
			.map(selector => selector.element)
			.filter((selector): selector is string => selector !== null)
	);
	const findings: PositionedFinding[] = [];
	for (const node of getElementsAndTemplates(nodes)) {
		if (isElementNode(node)) {
			findings.push(...getUnknownComponentFindings(code, node, componentSelectors));
		}
		findings.push(...getDeprecatedTemplateApiFindings(code, node, matcher));
	}
	return findings;
}

function createSelectorMatcher(
	publicTemplateApis: readonly ObliqueAngularTemplateApi[]
): SelectorMatcher<ObliqueAngularTemplateApi> {
	const matcher = new SelectorMatcher<ObliqueAngularTemplateApi>();
	for (const templateApi of publicTemplateApis) {
		matcher.addSelectables(CssSelector.parse(templateApi.selector), templateApi);
	}
	return matcher;
}

function getElementsAndTemplates(nodes: readonly TmplAstNode[]): (TmplAstElement | TmplAstTemplate)[] {
	const elementsAndTemplates: (TmplAstElement | TmplAstTemplate)[] = [];
	for (const node of nodes) {
		collectElementsAndTemplates(node, elementsAndTemplates);
	}
	return elementsAndTemplates;
}

function collectElementsAndTemplates(
	node: TmplAstNode,
	elementsAndTemplates: (TmplAstElement | TmplAstTemplate)[]
): void {
	if (isElementNode(node) || isTemplateNode(node)) {
		elementsAndTemplates.push(node);
	}
	for (const children of getChildNodeCollections(node)) {
		for (const child of children) {
			collectElementsAndTemplates(child, elementsAndTemplates);
		}
	}
}

function getChildNodeCollections(node: TmplAstNode): readonly TmplAstNode[][] {
	const emptyNode = getTemplateAstNode(getOwnPropertyValue(node, 'empty'));
	return [
		getNodeCollection(node, 'children'),
		getNodeCollection(node, 'branches'),
		getNodeCollection(node, 'groups'),
		getNodeCollection(emptyNode, 'children'),
	]
		.filter((children): children is TmplAstNode[] => children !== undefined)
		.filter(children => children.length > 0);
}

function getNodeCollection(node: object | undefined, property: string): TmplAstNode[] | undefined {
	const value = node === undefined ? undefined : getOwnPropertyValue(node, property);
	return Array.isArray(value) ? value : undefined;
}

function getTemplateAstNode(value: unknown): TmplAstNode | undefined {
	return isTemplateAstNode(value) ? value : undefined;
}

function isTemplateAstNode(value: unknown): value is TmplAstNode {
	return typeof value === 'object' && value !== null && 'sourceSpan' in value && 'visit' in value;
}

function getOwnPropertyValue(node: object, property: string): unknown {
	return Object.getOwnPropertyDescriptor(node, property)?.value;
}

function isElementNode(node: TmplAstNode): node is TmplAstElement {
	return 'name' in node && 'attributes' in node && 'inputs' in node && 'children' in node;
}

function isTemplateNode(node: TmplAstNode): node is TmplAstTemplate {
	return 'templateAttrs' in node && 'attributes' in node && 'inputs' in node;
}

function getUnknownComponentFindings(
	code: string,
	node: TmplAstElement,
	componentSelectors: ReadonlySet<string>
): PositionedFinding[] {
	return node.name.startsWith(obliqueElementPrefix) && !componentSelectors.has(node.name)
		? [
				createFinding(code, node.startSourceSpan.start.offset + 1, {
					rule: 'OBLIQUE_UNKNOWN_COMPONENT_SELECTOR',
					severity: 'error',
					message: `"${node.name}" is not a public Oblique component selector in the checked-out Oblique version.`,
					selector: node.name,
					recommendation: 'Use a component selector provided by the checked-out public Oblique API.',
				}),
			]
		: [];
}

function getDeprecatedTemplateApiFindings(
	code: string,
	node: TmplAstElement | TmplAstTemplate,
	matcher: SelectorMatcher<ObliqueAngularTemplateApi>
): PositionedFinding[] {
	const matchedTemplateApis = new Map<string, ObliqueAngularTemplateApi>();
	matcher.match(createNodeSelector(node), (selector, templateApi) => {
		void selector;
		matchedTemplateApis.set(`${templateApi.symbol}\u0000${templateApi.selector}`, templateApi);
	});
	const nonDeprecatedSelectors = new Set(
		[...matchedTemplateApis.values()]
			.filter(templateApi => !templateApi.deprecated)
			.map(templateApi => templateApi.selector)
	);
	return [...matchedTemplateApis.values()]
		.filter(templateApi => templateApi.deprecated && !nonDeprecatedSelectors.has(templateApi.selector))
		.sort(compareTemplateApis)
		.map(templateApi =>
			createFinding(code, getTemplateApiPosition(node, templateApi), {
				rule: 'OBLIQUE_DEPRECATED_TEMPLATE_API',
				severity: 'warning',
				message: getDeprecatedMessage(templateApi),
				selector: templateApi.selector,
				symbol: templateApi.symbol,
				recommendation: getDeprecatedRecommendation(templateApi),
			})
		);
}

function createNodeSelector(node: TmplAstElement | TmplAstTemplate): CssSelector {
	const selector = new CssSelector();
	selector.setElement(isElementNode(node) ? node.name : node.tagName);
	for (const attribute of getStaticAttributes(node)) {
		selector.addAttribute(attribute.name, attribute.value);
		if (attribute.name === 'class') {
			for (const className of attribute.value.split(/\s+/u).filter(Boolean)) {
				selector.addClassName(className);
			}
		}
	}
	for (const input of getBoundAttributes(node)) {
		selector.addAttribute(input.name);
	}
	return selector;
}

function getStaticAttributes(node: TmplAstElement | TmplAstTemplate): readonly TmplAstTextAttribute[] {
	return isTemplateNode(node) ? [...node.attributes, ...node.templateAttrs.filter(isTextAttribute)] : node.attributes;
}

function getBoundAttributes(node: TmplAstElement | TmplAstTemplate): readonly TmplAstBoundAttribute[] {
	return isTemplateNode(node) ? [...node.inputs, ...node.templateAttrs.filter(isBoundAttribute)] : node.inputs;
}

function isTextAttribute(attribute: TmplAstTextAttribute | TmplAstBoundAttribute): attribute is TmplAstTextAttribute {
	return 'value' in attribute && typeof attribute.value === 'string';
}

function isBoundAttribute(attribute: TmplAstTextAttribute | TmplAstBoundAttribute): attribute is TmplAstBoundAttribute {
	return !isTextAttribute(attribute);
}

function getTemplateApiPosition(
	node: TmplAstElement | TmplAstTemplate,
	templateApi: ObliqueAngularTemplateApi
): number {
	if (templateApi.kind === 'component' || !isElementNode(node)) {
		return node.startSourceSpan.start.offset + 1;
	}
	const directiveAttribute = getDirectiveAttribute(node, templateApi.selector);
	return directiveAttribute?.sourceSpan.start.offset ?? node.startSourceSpan.start.offset + 1;
}

function getDirectiveAttribute(
	node: TmplAstElement,
	selector: string
): TmplAstTextAttribute | TmplAstBoundAttribute | undefined {
	const attributeNames = CssSelector.parse(selector).flatMap(cssSelector =>
		cssSelector.getAttrs().filter((attributeValue, index) => {
			void attributeValue;
			return index % 2 === 0;
		})
	);
	return [...node.attributes, ...node.inputs].find(attribute => attributeNames.includes(attribute.name));
}

function compareTemplateApis(first: ObliqueAngularTemplateApi, second: ObliqueAngularTemplateApi): number {
	return first.symbol.localeCompare(second.symbol, 'en') || first.selector.localeCompare(second.selector, 'en');
}

function getDeprecatedMessage(templateApi: ObliqueAngularTemplateApi): string {
	return templateApi.documentation === null
		? `"${templateApi.symbol}" is a deprecated public Oblique template API.`
		: `"${templateApi.symbol}" is a deprecated public Oblique template API. ${templateApi.documentation}`;
}

function getDeprecatedRecommendation(templateApi: ObliqueAngularTemplateApi): string {
	return templateApi.documentation === null
		? 'Avoid deprecated public Oblique template APIs when a documented migration is available.'
		: 'Review the public API documentation for deprecation guidance.';
}

function createFinding(
	code: string,
	position: number,
	finding: Omit<ObliqueTemplateFinding, 'location'>
): PositionedFinding {
	return {...finding, location: getLocation(code, position), position};
}

function getLocation(code: string, position: number): ObliqueTemplateLocation {
	const boundedPosition = Math.max(0, Math.min(position, code.length));
	const beforePosition = code.slice(0, boundedPosition);
	const line = beforePosition.split('\n').length;
	return {line, column: boundedPosition - beforePosition.lastIndexOf('\n')};
}

function compareFindings(first: PositionedFinding, second: PositionedFinding): number {
	return (
		first.position - second.position ||
		severityOrder[first.severity] - severityOrder[second.severity] ||
		first.rule.localeCompare(second.rule, 'en')
	);
}

function getSummary(findings: readonly PositionedFinding[]): ObliqueTemplateSummary {
	return {
		errors: findings.filter(finding => finding.severity === 'error').length,
		warnings: findings.filter(finding => finding.severity === 'warning').length,
		info: findings.filter(finding => finding.severity === 'info').length,
	};
}

function toFinding({position, ...finding}: PositionedFinding): ObliqueTemplateFinding {
	void position;
	return finding;
}
