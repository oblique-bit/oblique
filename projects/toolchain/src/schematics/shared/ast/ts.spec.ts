import {HostTree, type Tree} from '@angular-devkit/schematics';
import {NoopChange} from '@schematics/angular/utility/change';
import {type CallExpression, type CatchClause, ScriptTarget, SyntaxKind, createSourceFile} from 'typescript';
import {
	applyChanges,
	applyEdits,
	createSrcFile,
	findClassDeclaration,
	insertClassProperty,
	removeClassProperty,
	removeStatement,
	transformSourceFile,
	transformSourceFileWithTypeCheck,
} from './ts';

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

	const appComponent = `import {Component, signal} from '@angular/core';\n@Component({selector: 'app-root'})\nexport class App {\n\tprotected readonly title = signal('test');\n}`;
	const appSpec = `import {TestBed} from '@angular/core/testing';\nimport {App} from './app';\ndescribe('App', () => {\n\tit('should create the app', () => {});\n\tit('should render title', () => {});\n});`;

	function createTree(content: string, path = 'src/app/app.ts'): Tree {
		const tree = new HostTree();
		tree.create(path, content);
		return tree;
	}

	describe(createSrcFile.name, () => {
		test('parses a file from the tree', () => {
			const tree = createTree(appComponent);
			const sourceFile = createSrcFile(tree, 'src/app/app.ts');
			expect(sourceFile.statements.length).toBeGreaterThan(0);
		});
	});

	describe(applyChanges.name, () => {
		test('applies a noop change without modifying the file', () => {
			const tree = createTree(appComponent);
			applyChanges(tree, 'src/app/app.ts', [new NoopChange()]);
			expect(tree.readText('src/app/app.ts')).toBe(appComponent);
		});
	});

	describe(findClassDeclaration.name, () => {
		test('finds a class by name', () => {
			const sourceFile = createSourceFile('app.ts', appComponent, ScriptTarget.Latest, true);
			const classDeclaration = findClassDeclaration(sourceFile, 'App');
			expect(classDeclaration?.name?.text).toBe('App');
		});

		test('returns undefined when class is not found', () => {
			const sourceFile = createSourceFile('app.ts', appComponent, ScriptTarget.Latest, true);
			expect(findClassDeclaration(sourceFile, 'Missing')).toBeUndefined();
		});
	});

	describe(removeClassProperty.name, () => {
		test('removes a property from a class', () => {
			const tree = createTree(appComponent);
			const sourceFile = createSrcFile(tree, 'src/app/app.ts');
			applyChanges(tree, 'src/app/app.ts', [removeClassProperty(sourceFile, 'App', 'title')]);
			expect(tree.readText('src/app/app.ts')).not.toContain('title');
		});

		test('returns a noop change when property is missing', () => {
			const sourceFile = createSourceFile('app.ts', appComponent, ScriptTarget.Latest, true);
			expect(removeClassProperty(sourceFile, 'App', 'missing')).toBeInstanceOf(NoopChange);
		});

		test('returns a noop change when class is missing', () => {
			const sourceFile = createSourceFile('app.ts', appComponent, ScriptTarget.Latest, true);
			expect(removeClassProperty(sourceFile, 'Missing', 'title')).toBeInstanceOf(NoopChange);
		});
	});

	describe(insertClassProperty.name, () => {
		test('inserts a property into a class', () => {
			const tree = createTree(appComponent);
			const sourceFile = createSrcFile(tree, 'src/app/app.ts');
			applyChanges(tree, 'src/app/app.ts', [
				insertClassProperty(sourceFile, 'App', 'readonly year = signal(new Date().getFullYear());'),
			]);
			expect(tree.readText('src/app/app.ts')).toContain('readonly year = signal(new Date().getFullYear());');
		});

		test('returns a noop change when class is missing', () => {
			const sourceFile = createSourceFile('app.ts', appComponent, ScriptTarget.Latest, true);
			expect(insertClassProperty(sourceFile, 'Missing', 'readonly year = signal(0);')).toBeInstanceOf(NoopChange);
		});

		test('inserts a property into an empty class', () => {
			const tree = createTree(`export class App {}`);
			const sourceFile = createSrcFile(tree, 'src/app/app.ts');
			applyChanges(tree, 'src/app/app.ts', [insertClassProperty(sourceFile, 'App', 'readonly year = signal(0);')]);
			expect(tree.readText('src/app/app.ts')).toContain('readonly year = signal(0);');
		});

		test('inserts a property into a single-line class', () => {
			const tree = createTree(`export class App { readonly year = signal(0); }`);
			const sourceFile = createSrcFile(tree, 'src/app/app.ts');
			applyChanges(tree, 'src/app/app.ts', [insertClassProperty(sourceFile, 'App', 'readonly other = signal(1);')]);
			expect(tree.readText('src/app/app.ts')).toContain('readonly other = signal(1);');
		});
	});

	describe(removeStatement.name, () => {
		test('removes a matching statement', () => {
			const tree = createTree(appSpec, 'src/app/app.spec.ts');
			const sourceFile = createSrcFile(tree, 'src/app/app.spec.ts');
			applyChanges(tree, 'src/app/app.spec.ts', [
				removeStatement(sourceFile, 'src/app/app.spec.ts', statement =>
					statement.getText(sourceFile).includes('should render title')
				),
			]);
			expect(tree.readText('src/app/app.spec.ts')).not.toContain('should render title');
		});

		test('removes only the matching statement, not its enclosing block', () => {
			// Mirrors the real Angular CLI generated app.spec.ts where the title test is nested
			// inside a describe block that also contains a beforeEach and another test.
			const realSpec = `import { TestBed } from '@angular/core/testing';\nimport { RouterModule } from '@angular/router';\nimport { App } from './app';\n\ndescribe('App', () => {\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      imports: [\n        RouterModule.forRoot([])\n      ],\n      declarations: [\n        App\n      ],\n    })\n      .compileComponents();\n  });\n\n  it('should create the app', () => {\n    const fixture = TestBed.createComponent(App);\n    const app = fixture.componentInstance;\n    expect(app).toBeTruthy();\n  });\n\n  it('should render title', () => {\n    const fixture = TestBed.createComponent(App);\n    fixture.detectChanges();\n    const compiled = fixture.nativeElement as HTMLElement;\n    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, test');\n  });\n});`;
			const tree = createTree(realSpec, 'src/app/app.spec.ts');
			const sourceFile = createSrcFile(tree, 'src/app/app.spec.ts');
			applyChanges(tree, 'src/app/app.spec.ts', [
				removeStatement(sourceFile, 'src/app/app.spec.ts', statement =>
					statement.getText(sourceFile).includes('should render title')
				),
			]);
			const result = tree.readText('src/app/app.spec.ts');
			expect(result).not.toContain('should render title');
			// The describe block and the other test must survive.
			expect(result).toContain("describe('App'");
			expect(result).toContain('should create the app');
			expect(result).toContain('TestBed.configureTestingModule');
		});

		test('returns a noop change when no statement matches', () => {
			const sourceFile = createSourceFile('app.spec.ts', appSpec, ScriptTarget.Latest, true);
			expect(removeStatement(sourceFile, 'app.spec.ts', () => false)).toBeInstanceOf(NoopChange);
		});
	});
});
