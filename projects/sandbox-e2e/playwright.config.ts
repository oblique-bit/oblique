import {defineConfig, devices} from '@playwright/test';

import {findObliqueRootPath} from '../../scripts/shared/root';

const sandboxPort = Number(process.env['SANDBOX_PORT'] ?? '3001');
const sandboxHost = process.env['SANDBOX_HOST'] ?? '127.0.0.1';
const baseURL = `http://${sandboxHost}:${sandboxPort}`;
const isCI = process.env['CI'] === 'true' || process.env['CI'] === '1';

// Path to the monorepo root, where the sandbox start script is run from.
const obliqueRepoPath = process.env['OBLIQUE_REPO_PATH'] ?? findObliqueRootPath();

export default defineConfig({
	testDir: './e2e/sandbox',
	fullyParallel: false,
	forbidOnly: isCI,
	retries: isCI ? 1 : 0,
	workers: isCI ? 1 : undefined,
	timeout: 30_000,
	expect: {
		timeout: 12_000,
	},
	reporter: [
		['line'],
		['html', {open: 'never', outputFolder: 'artifacts/playwright/html'}],
		['junit', {outputFile: 'artifacts/playwright/junit/sandbox-e2e.xml'}],
	],
	outputDir: 'artifacts/playwright/output',
	use: {
		baseURL,
		headless: true,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		navigationTimeout: 30_000,
		actionTimeout: 12_000,
	},
	projects: [
		{
			name: 'chromium',
			use: {...devices['Desktop Chrome']},
		},
	],
	webServer: {
		command: `npm run start -w @oblique/sandbox -- --configuration development --host 0.0.0.0 --port ${sandboxPort}`,
		url: baseURL,
		reuseExistingServer: !isCI,
		timeout: 180_000,
		cwd: obliqueRepoPath,
	},
});
