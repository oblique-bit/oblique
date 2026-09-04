import {type Rule, type Tree, chain} from '@angular-devkit/schematics';
import {
	type BindingName,
	type CallExpression,
	type CatchClause,
	type Node,
	type ParameterDeclaration,
	type SourceFile,
	SyntaxKind,
	type Type,
	type TypeChecker,
	type TypeNode,
	isArrowFunction,
	isFunctionExpression,
	isPropertyAccessExpression,
} from 'typescript';
import type {ObGroupLogger} from '../../../logger';
import type {Edit} from '../../shared/ast/types';
import {applyEdits, transformSourceFile, transformSourceFileWithTypeCheck} from '../../shared/ast/ts';
import {closeLogger} from '../../shared/logger-close';
import {rewriteFiles} from '../../shared/rewrite-files';

interface TypeEdit {
	end: number;
	name: BindingName;
	needsParentheses: boolean;
	sourceFile: SourceFile;
	type: TypeNode | undefined;
}

export function useUnknownInCatchVariables(logger: ObGroupLogger): Rule {
	return () => {
		const loggerGroup = logger.group('Type catch variables as unknown');
		return chain([fixCatchVariables(), closeLogger(loggerGroup)]);
	};
}

function fixCatchVariables(): Rule {
	return (tree: Tree) => rewriteFiles(tree, path => path.endsWith('.ts'), rewriteCatchVariables);
}

/**
 * Rewrites catch variables that are not already typed as `unknown` to `unknown`, so the code
 * complies with the `use-unknown-in-catch-variables` ESLint rules. It covers two cases:
 * - `try...catch` clauses, e.g. `catch (e)` -> `catch (e: unknown)` and `catch (e: any)` -> `catch (e: unknown)`.
 * - Promise rejection callbacks, e.g. `promise.catch((e) => {})` -> `promise.catch((e: unknown) => {})`
 *   and the paren-less form `promise.catch(e => {})` -> `promise.catch((e: unknown) => {})`. Only
 *   calls on an actual `Promise` are considered, so a `catch` method of an unrelated object is left
 *   untouched.
 *
 * @param source - The TypeScript source text to transform.
 * @returns The transformed source text, unchanged if nothing needed fixing.
 */
function rewriteCatchVariables(source: string): string {
	const edits = [
		...transformSourceFile<CatchClause>(source, SyntaxKind.CatchClause, (node, sourceFile) =>
			collectCatchClauseEdits(node, sourceFile)
		),
		...transformSourceFileWithTypeCheck<CallExpression>(
			{source, additionalLibs: ['lib.es2015.promise.d.ts']},
			SyntaxKind.CallExpression,
			(call, sourceFile, typeChecker) => collectPromiseCatchEdits(call, sourceFile, typeChecker)
		),
	];
	return applyEdits(source, edits);
}

/**
 * Types the catch variable of a `try...catch` clause as `unknown`.
 */
function collectCatchClauseEdits(clause: CatchClause, sourceFile: SourceFile): Edit[] {
	const variable = clause.variableDeclaration;
	if (!variable) {
		return [];
	}
	return collectUnknownTypeEdits({
		end: variable.end,
		name: variable.name,
		needsParentheses: false,
		sourceFile,
		type: variable.type,
	});
}

/**
 * Types the first parameter of a promise rejection callback (`.catch(...)`) as `unknown`. Only
 * calls whose receiver is actually a `Promise` are considered; unrelated `catch` methods are left
 * untouched.
 */
function collectPromiseCatchEdits(call: CallExpression, sourceFile: SourceFile, typeChecker: TypeChecker): Edit[] {
	if (!isPromiseCatchCall(call, typeChecker)) {
		return [];
	}
	const callback = call.arguments[0];
	const parameter = getRejectionParameter(callback);
	return parameter
		? collectUnknownTypeEdits({
				end: parameter.end,
				name: parameter.name,
				needsParentheses: hasUnparenthesizedParameter(callback, sourceFile),
				sourceFile,
				type: parameter.type,
			})
		: [];
}

/**
 * Checks whether a call is a `.catch(...)` on a `Promise`. A `catch` method of any other object is
 * ignored.
 */
function isPromiseCatchCall(call: CallExpression, typeChecker: TypeChecker): boolean {
	const callee = call.expression;
	if (!isPropertyAccessExpression(callee) || callee.name.text !== 'catch') {
		return false;
	}
	return isPromiseType(typeChecker.getTypeAtLocation(callee.expression));
}

/**
 * Returns whether the given type is (or, for a union type, contains) a `Promise`.
 */
function isPromiseType(type: Type): boolean {
	const isPromise = (candidate: Type): boolean => candidate.getSymbol()?.getName() === 'Promise';
	return type.isUnion() ? type.types.some(isPromise) : isPromise(type);
}

/**
 * Returns the first parameter of a promise rejection callback, or `undefined` when the argument is
 * not a function.
 */
function getRejectionParameter(callback: Node | undefined): ParameterDeclaration | undefined {
	return callback && (isArrowFunction(callback) || isFunctionExpression(callback)) ? callback.parameters[0] : undefined;
}

/**
 * Detects whether a callback's first parameter is not wrapped in parentheses, e.g. `e => {}`
 * instead of `(e) => {}`. Such a parameter needs to be wrapped before a type annotation can be
 * added. Only a single-parameter arrow function can be unparenthesized; function expressions and
 * the other function forms are always parenthesized.
 *
 * @param callback - The callback to inspect, or nothing.
 * @param sourceFile - The source file the callback belongs to.
 * @returns Whether the callback's first parameter is not wrapped in parentheses.
 */
function hasUnparenthesizedParameter(callback: Node | undefined, sourceFile: SourceFile): boolean {
	if (!callback || !isArrowFunction(callback)) {
		return false;
	}
	const parameter = callback.parameters[0];
	return sourceFile.text.slice(parameter.end, callback.equalsGreaterThanToken.getStart(sourceFile)).trim() === '';
}

/**
 * Types a catch variable that is an identifier as `unknown` when it has no type annotation or an
 * `any` annotation. Destructuring patterns are left untouched because they cannot simply be typed
 * as `unknown`.
 */
function collectUnknownTypeEdits({end, name, needsParentheses, sourceFile, type}: TypeEdit): Edit[] {
	if (name.kind !== SyntaxKind.Identifier || (type && type.kind !== SyntaxKind.AnyKeyword)) {
		return [];
	}
	if (type) {
		return [{start: type.getStart(sourceFile), end: type.end, text: 'unknown'}];
	}
	if (needsParentheses) {
		return [
			{start: name.getStart(sourceFile), end: name.getStart(sourceFile), text: '('},
			{start: end, end, text: ': unknown)'},
		];
	}
	return [{start: end, end, text: ': unknown'}];
}
