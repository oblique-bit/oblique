import {workspaces} from '@angular-devkit/core';
import {Tree} from '@angular-devkit/schematics';
import {WorkspaceDefinition} from '@schematics/angular/utility';
import {WorkspaceFormat} from '@angular-devkit/core/src/workspace/index';
import {createHost} from './host.utils';
import {ProjectDefinition} from '@angular-devkit/core/src/workspace/definitions';

export async function getSdsSourceRootPath(tree: Tree): Promise<string> {
	const workspaceDefinition: WorkspaceDefinition = await getWorkspaceDefinition(tree);
	const projectDefinition: ProjectDefinition = workspaceDefinition.projects.get('sds');
	return projectDefinition.sourceRoot;
}

async function getWorkspaceDefinition(tree: Tree): Promise<WorkspaceDefinition> {
	const host = createHost(tree);
	const {workspace} = await workspaces.readWorkspace('/', host, WorkspaceFormat.JSON);
	return workspace;
}
