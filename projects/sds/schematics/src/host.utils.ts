import {SchematicsException, Tree} from '@angular-devkit/schematics';
import {virtualFs, workspaces} from '@angular-devkit/core';

/* eslint-disable @typescript-eslint/require-await*/

export function createHost(tree: Tree): workspaces.WorkspaceHost {
	return {
		async readFile(path: string): Promise<string> {
			const data = tree.read(path);
			if (!data) {
				throw new SchematicsException(`Error: File not found at path ${path}`);
			}
			return virtualFs.fileBufferToString(data);
		},
		async writeFile(path: string, data: string): Promise<void> {
			return tree.overwrite(path, data);
		},
		async isDirectory(path: string): Promise<boolean> {
			return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
		},
		async isFile(path: string): Promise<boolean> {
			return tree.exists(path);
		}
	};
}
