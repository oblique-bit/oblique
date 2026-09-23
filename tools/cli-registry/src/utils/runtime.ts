import {randomBytes} from 'node:crypto';
import {chmodSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const registryUrl = 'http://127.0.0.1:4873';
export const registryHost = new URL(registryUrl).host;
export const registryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const runtimeDirectory = join(registryRoot, 'runtime');
export const npmrcPath = join(runtimeDirectory, 'npmrc');
export const verdaccioPath = join(registryRoot, 'node_modules/verdaccio/bin/verdaccio');
export const configPath = join(registryRoot, 'config.yaml');
export const registryStartupTimeout = 30_000;
export const readinessPollInterval = 250;
const credentialByteLength = 32;
const privateFileMode = 0o600;

/** Credentials used by the private local Verdaccio instance. */
interface Credentials {
	username: string;
	password: string;
}

/** Creates the ignored runtime files consumed by Verdaccio and npm. */
export function ensureRuntimeFiles(directory: string = runtimeDirectory): void {
	ensureStorageDirectory(directory);
	const credentials = ensureCredentials(directory);
	writeHtpasswd(directory, credentials);
	writeNpmrc(directory, credentials);
	setRuntimeFilePermissions(directory);
}

/** Ensures Verdaccio has a persistent package storage directory. */
function ensureStorageDirectory(directory: string): void {
	mkdirSync(join(directory, 'storage'), {recursive: true});
}

/** Loads the local credentials or creates them when the runtime is initialized. */
function ensureCredentials(directory: string): Credentials {
	const existingCredentials = readCredentials(directory);
	if (existingCredentials) {
		return existingCredentials;
	}

	const credentials: Credentials = {
		username: 'oblique-local',
		password: randomBytes(credentialByteLength).toString('hex'),
	};
	writeFileSync(join(directory, 'credentials.json'), `${JSON.stringify(credentials, null, '\t')}\n`, 'utf8');
	return credentials;
}

/** Reads valid persisted credentials, returning undefined for missing or invalid data. */
function readCredentials(directory: string): Credentials | undefined {
	try {
		const parsed: unknown = JSON.parse(readFileSync(join(directory, 'credentials.json'), 'utf8'));
		return isCredentials(parsed) ? parsed : undefined;
	} catch {
		return undefined;
	}
}

/** Narrows parsed JSON to the credential shape required by the registry. */
function isCredentials(value: unknown): value is Credentials {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return (
		'username' in value &&
		typeof value.username === 'string' &&
		'password' in value &&
		typeof value.password === 'string'
	);
}

/** Writes the credentials consumed by Verdaccio's htpasswd plugin. */
function writeHtpasswd(directory: string, credentials: Credentials): void {
	writeFileSync(
		join(directory, 'htpasswd'),
		`${credentials.username}:{PLAIN}${credentials.password}:autocreated\n`,
		'utf8'
	);
}

/** Writes the npm configuration and registry credentials used by callers. */
function writeNpmrc(directory: string, credentials: Credentials): void {
	const token = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
	writeFileSync(
		join(directory, 'npmrc'),
		`registry=${registryUrl}/\n@oblique:registry=${registryUrl}/\n//${registryHost}/:_auth=${token}\n`,
		'utf8'
	);
}

/** Restricts generated credential files where the operating system supports it. */
function setRuntimeFilePermissions(directory: string): void {
	try {
		chmodSync(join(directory, 'credentials.json'), privateFileMode);
		chmodSync(join(directory, 'htpasswd'), privateFileMode);
		chmodSync(join(directory, 'npmrc'), privateFileMode);
	} catch {
		// Windows does not support Unix file permissions.
	}
}

/** Returns whether Verdaccio currently accepts its health-check request. */
export async function isRegistryReady(): Promise<boolean> {
	try {
		return (await fetch(`${registryUrl}/-/ping`)).ok;
	} catch {
		return false;
	}
}
