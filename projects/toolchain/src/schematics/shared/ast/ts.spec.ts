import {type CallExpression, type CatchClause, SyntaxKind} from 'typescript';
import {applyEdits, transformSourceFile, transformSourceFileWithTypeCheck} from './ts';

describe('ast-ts', () => {
	describe(transformSourceFile.name, () => {
		test('returns no edits when no node matches the kind', () => {
			const edits = transformSourceFileWithTypeCheck('const x = 1;', SyntaxKind.CatchClause, () => []);
			expect(edits).toEqual([]);
		});

		test('returns edits reported for matching nodes only', () => {
			const edits = transformSourceFile('const x = 1;', SyntaxKind.Identifier, node => [
				{start: node.end, end: node.end, text: '!!'},
			]);
			expect(edits).toEqual([{start: 7, end: 7, text: '!!'}]);
		});

		test('types the visited node as the requested kind', () => {
			const source = 'try {} catch (e) {}';
			const edits = transformSourceFile<CatchClause>(source, SyntaxKind.CatchClause, node => {
				const variable = node.variableDeclaration;
				return variable ? [{start: variable.end, end: variable.end, text: ': unknown'}] : [];
			});
			expect(edits).toEqual([{start: 15, end: 15, text: ': unknown'}]);
		});

		test('ignores a visitor that returns nothing', () => {
			const edits = transformSourceFile<CatchClause>('try {} catch (e) {}', SyntaxKind.CatchClause, () => undefined);
			expect(edits).toEqual([]);
		});

		test('calls the visitor only for nodes of the requested kind', () => {
			const calls: number[] = [];
			transformSourceFile<CatchClause>('try {} catch (e) {}', SyntaxKind.CatchClause, node => {
				calls.push(node.getStart());
				return [];
			});
			expect(calls).toEqual([7]);
		});
	});

	describe(transformSourceFileWithTypeCheck.name, () => {
		test('visits matching nodes with the parsed source file', () => {
			const edits = transformSourceFileWithTypeCheck<CallExpression>(
				{source: 'Promise.resolve().catch(e => {})', additionalLibs: ['lib.es2015.promise.d.ts']},
				SyntaxKind.CallExpression,
				(node, sourceFile) => [{start: node.end, end: node.end, text: sourceFile.fileName}]
			);
			expect(edits).toHaveLength(2);
			expect(edits[0].text).toBe('untitled.ts');
		});

		test('provides a type checker that resolves a Promise receiver', () => {
			const edits = transformSourceFileWithTypeCheck<CallExpression>(
				{source: 'Promise.resolve().catch(e => {})', additionalLibs: ['lib.es2015.promise.d.ts']},
				SyntaxKind.CallExpression,
				(node, sourceFile, typeChecker) => {
					const callee = node.expression;
					if (callee.kind === SyntaxKind.PropertyAccessExpression && callee.name.text === 'catch') {
						return typeChecker.getTypeAtLocation(callee.expression).getSymbol()?.getName() === 'Promise'
							? [{start: 0, end: 0, text: ''}]
							: [];
					}
					return [];
				}
			);
			expect(edits).toEqual([{start: 0, end: 0, text: ''}]);
		});

		test('resolves a catch method of a non-promise object as not a Promise', () => {
			const edits = transformSourceFileWithTypeCheck<CallExpression>(
				{source: 'const registry = {catch() {}}; registry.catch(e => {})', additionalLibs: ['lib.es2015.promise.d.ts']},
				SyntaxKind.CallExpression,
				(node, sourceFile, typeChecker) => {
					const callee = node.expression;
					if (callee.kind === SyntaxKind.PropertyAccessExpression && callee.name.text === 'catch') {
						return typeChecker.getTypeAtLocation(callee.expression).getSymbol()?.getName() === 'Promise'
							? [{start: 0, end: 0, text: 'rewrite'}]
							: [];
					}
					return [];
				}
			);
			expect(edits).toEqual([]);
		});

		test('returns no edits when no node matches the kind', () => {
			const edits = transformSourceFileWithTypeCheck(
				{source: 'const x = 1;', additionalLibs: []},
				SyntaxKind.CatchClause,
				() => []
			);
			expect(edits).toEqual([]);
		});

		test('ignores a visitor that returns nothing', () => {
			const edits = transformSourceFileWithTypeCheck<CallExpression>(
				{source: 'Promise.resolve()', additionalLibs: ['lib.es2015.promise.d.ts']},
				SyntaxKind.CallExpression,
				() => undefined
			);
			expect(edits).toEqual([]);
		});
	});

	describe(applyEdits.name, () => {
		test('returns the source unchanged when there are no edits', () => {
			expect(applyEdits('const x = 1;', [])).toBe('const x = 1;');
		});

		test('applies a single insertion edit', () => {
			expect(applyEdits('const x = 1;', [{start: 7, end: 7, text: '!!'}])).toBe('const x!! = 1;');
		});

		test('applies a single replacement edit', () => {
			expect(applyEdits('const x = 1;', [{start: 6, end: 7, text: 'y'}])).toBe('const y = 1;');
		});

		test('applies multiple edits regardless of position', () => {
			const edits = [
				{start: 7, end: 7, text: '!!'},
				{start: 6, end: 7, text: 'left'},
			];
			expect(applyEdits('const x = 1;', edits)).toBe('const left!! = 1;');
		});
	});
});
