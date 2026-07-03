import type {Tree} from '@angular-devkit/schematics';
import {applyEdits, modify} from 'jsonc-parser';
import {type JsonObject, isJsonObject} from '@angular-devkit/core';
import {ObFileNotFoundError} from './errors/file-not-found-error';
import {ObInvalidJsonError} from './errors/invalid-json';
import type {ObJsonProperty, ObMakeOptional} from './types';

/**
 * Reads and parses a file as JSON
 *
 * @param tree - The schematics tree to read from
 * @param filepath - The path to the file to read
 * @throws {ObFileNotFoundError} if package.json does not exist
 * @throws {ObInvalidJsonError} if package.json is not valid
 * @return
 */
export function readJson(tree: Tree, filepath: string): JsonObject {
	if (!tree.exists(filepath)) {
		throw new ObFileNotFoundError(filepath);
	}
	const json = (() => {
		try {
			return tree.readJson(filepath);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : undefined;
			throw new ObInvalidJsonError(filepath, errorMessage);
		}
	})();

	if (!isJsonObject(json)) {
		throw new ObInvalidJsonError(filepath);
	}
	return json;
}

/**
 * Adds or updates a property in a JSON file.
 *
 * The property key supports dot notation to modify nested properties (for
 * example, `scripts.build`).
 *
 * @param tree - The schematics tree containing the file.
 * @param filepath - The path to the JSON file.
 * @param property - The property to add or update.
 * @throws {ObFileNotFoundError} If the file does not exist.
 * @throws {ObInvalidJsonError} If the file does not contain valid JSON.
 */
export function addPropertyToJsonFile(tree: Tree, filepath: string, property: ObJsonProperty): void {
	editProperty(tree, filepath, property);
}

/**
 * Removes a property from a JSON file.
 *
 * The property key supports dot notation to remove nested properties (for
 * example, `scripts.build`). If the property does not exist, no changes are
 * made.
 *
 * @param tree - The schematics tree containing the file.
 * @param filepath - The path to the JSON file.
 * @param property - The property to remove.
 * @throws {ObFileNotFoundError} If the file does not exist.
 * @throws {ObInvalidJsonError} If the file does not contain valid JSON.
 */
export function deletePropertyFromJsonFile(tree: Tree, filepath: string, property: string): void {
	editProperty(tree, filepath, {key: property, value: undefined});
}

function editProperty(tree: Tree, filepath: string, property: ObMakeOptional<ObJsonProperty, 'value'>): void {
	readJson(tree, filepath); // validates file existence and content
	const content = tree.readText(filepath);
	const path = property.key.split('.').filter(Boolean);
	try {
		// modify fails when trying to delete a property on a non-existent parent
		const edits = modify(content, path, property.value, {});
		if (edits.length) {
			tree.overwrite(filepath, applyEdits(content, edits));
		}
	} catch {
		// nothing to do
	}
}
