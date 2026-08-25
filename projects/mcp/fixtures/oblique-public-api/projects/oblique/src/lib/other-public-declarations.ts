/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 3 public API reader test fixture
 */

import type {CanDeactivate as RouterCanDeactivate} from '@angular/router';

interface CanSomething {}

interface Marker {}

function plainDecorator(_target: Function): void {
	/* test decorator */
}

const decorators = {plainDecorator};

@decorators.plainDecorator
export class PlainPublicClass implements Marker {}

export class Example implements CanSomething {}

export class RouterGuard implements RouterCanDeactivate<unknown> {
	canDeactivate(): boolean {
		return true;
	}
}

export class PublicUnknownGuard implements MissingGuard {}

@missingDecorator
export class DecoratorWithoutSymbol {}

export let PublicMutableValue = 1;

export namespace PublicNamespace {
	export type Value = string;
}
