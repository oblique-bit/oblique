import {join} from 'node:path';
import {readFileSync, readdirSync} from 'fs';
import type {Tree} from '@angular-devkit/schematics';
import * as template from './shared/template/template';

/**
 * In tests based on {@link callRule}, the SchematicContext do not contain the template directory, meaning that
 * {@link createFromTemplate} throws an error. To circumvent this problem, `mockCreateFromTemplate` manually
 * creates the files
 */
export function mockCreateFromTemplate(collection: string): void {
	jest.spyOn(template, 'createFromTemplate').mockImplementation((templateDir: string) => (tree: Tree) => {
		const dir = join(__dirname, `/${collection}/${templateDir}`);
		readdirSync(dir).forEach(file => {
			const content = readFileSync(`${dir}/${file}`);
			tree.create(`/${file}`, content);
		});

		return tree;
	});
}
