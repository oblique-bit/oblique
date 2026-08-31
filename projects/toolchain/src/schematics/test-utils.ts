import {type Rule, type SchematicContext, type Tree, callRule} from '@angular-devkit/schematics';
import {type SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {firstValueFrom, of} from 'rxjs';

/**
 * Runs a {@link Rule} with a {@link SchematicContext} and returns the resulting tree.
 *
 * This is the single entry point to execute a rule in the toolchain tests. It reproduces the context
 * DevKit creates when running a schematic, without requiring the factory to be resolved from a collection
 * (which Node's synchronous `require` cannot do for TypeScript sources under Vitest).
 *
 * Angular DevKit rules that rely on `url`/`template` (e.g. {@link createFromTemplate}) resolve relative
 * paths against `context.schematic.description.path`. Such rules must provide `path` (usually the
 * schematic directory) through the options.
 *
 * @returns The resulting tree wrapped in a {@link UnitTestTree}.
 */
export function runRule(
	runner: SchematicTestRunner,
	rule: Rule,
	options: {tree: Tree; path?: string}
): Promise<UnitTestTree> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- DevKit's Schematic type is not constructible from a test context
	const schematic = {description: {name: 'test', path: options.path ?? ''}} as unknown as Parameters<
		typeof runner.engine.createContext
	>[0];
	const context: SchematicContext = runner.engine.createContext(schematic, undefined);
	return firstValueFrom(callRule(rule, of(options.tree), context)).then(tree => new UnitTestTree(tree));
}
