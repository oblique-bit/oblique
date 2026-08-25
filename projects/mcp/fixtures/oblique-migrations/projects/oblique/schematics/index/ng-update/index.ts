/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 4 focused migration reader fixtures
 */

import {InternalUpdateV4toV5 as UpdateV4toV5} from './update-v4-to-v5';
import {UpdateV5toV6} from './update-v5-to-v6';
import {UpdateV7toV8} from './update-v7-to-v8';

export function upgradeToV5(): unknown {
	return startup(new UpdateV4toV5());
}

export function upgradeToV6(): unknown {
	return startup(new UpdateV5toV6());
}

export function upgradeToV8(): unknown {
	return startup(new UpdateV7toV8());
}

function startup(migration: unknown): unknown {
	return migration;
}
