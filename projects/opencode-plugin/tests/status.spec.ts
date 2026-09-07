import {describe, expect, it} from '@jest/globals';

import {buildObliqueStatusReport, registerObliqueStatusCommand, sanitizeForDisplay} from '../src/status.js';

describe('sanitizeForDisplay', () => {
	it('removes credentials and query strings from endpoints', () => {
		const sanitized = sanitizeForDisplay('https://user:secret@example.com/mcp?token=abc');
		expect(sanitized).toBe('https://example.com/mcp');
	});

	it('returns undefined for empty values', () => {
		expect(sanitizeForDisplay('')).toBeUndefined();
	});
});

describe('buildObliqueStatusReport', () => {
	it('aggregates project and MCP health for a healthy Oblique project', () => {
		const report = buildObliqueStatusReport(
			{
				projectRoot: '/tmp/demo',
				isAngularProject: true,
				isObliqueProject: true,
				angularVersion: '21.0.0',
				obliqueVersion: '15.4.4',
				packageManager: 'npm',
			},
			{
				mcp: {
					configured: true,
					mode: 'remote',
					endpoint: 'https://example.com/mcp',
					reachable: true,
					initialized: true,
					toolsAvailable: true,
				},
			}
		);

		expect(report.status).toBe('ok');
		expect(report.message).toContain('Angular: 21.0.0');
		expect(report.message).toContain('Oblique: 15.4.4');
		expect(report.message).toContain('tools/list available');
	});

	it('reports diagnostics when MCP cannot be reached', () => {
		const report = buildObliqueStatusReport(
			{
				projectRoot: '/tmp/demo',
				isAngularProject: true,
				isObliqueProject: true,
				angularVersion: '21.0.0',
				obliqueVersion: '15.4.4',
			},
			{
				mcp: {
					configured: true,
					mode: 'remote',
					endpoint: 'https://example.com/mcp',
					reachable: false,
					initialized: false,
					toolsAvailable: false,
					reason: 'connection refused',
				},
			}
		);

		expect(report.status).toBe('warning');
		expect(report.message).toContain('Server unreachable');
		expect(report.checks.mcp.reason).toBe('connection refused');
	});
});

describe('registerObliqueStatusCommand', () => {
	it('registers the status command for Oblique projects', () => {
		const updates: {name: string; template: string; description?: string}[] = [];
		const draft = {
			update: (
				name: string,
				mutate: (command: {name: string; template: string; description?: string}) => void
			): void => {
				const command = {name, template: ''};
				mutate(command);
				updates.push(command);
			},
		} as const;

		registerObliqueStatusCommand(draft, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
			angularVersion: '21.0.0',
			obliqueVersion: '15.4.4',
		});

		expect(updates).toHaveLength(1);
		expect(updates[0]?.name).toBe('oblique-status');
		expect(updates[0]?.template).toContain('/oblique-status');
		expect(updates[0]?.description).toContain('Oblique OpenCode Integration');
	});
});
