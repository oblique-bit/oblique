import {SchematicsException, type Tree} from '@angular-devkit/schematics';
import {readFileSync} from 'fs';
import {join} from 'node:path';

const templateDirPath = join(__dirname, 'templates');
export function createFromTemplate(targetPath: string, templateName: string, tree: Tree): Tree {
	const templatePath = join(templateDirPath, templateName);
	try {
		const content = readFileSync(templatePath, 'utf8');
		tree.create(targetPath, content);
		return tree;
	} catch {
		throw new SchematicsException(`Template not found at: ${templatePath}`);
	}
}
