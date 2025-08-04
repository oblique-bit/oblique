/**
 * Since Sandbox-SSR enforces stricter TypeScript rules than the Oblique library, it cannot import anything directly
 * from Oblique without causing numerous transpilation errors. Sandbox-SSR would apply its strict type checking to
 * Oblique’s code, which leads to these transpilation errors.
 * Therefore, the translation handling code must be duplicated within Sandbox-SSR to avoid these issues.
 */

export interface ObITranslationFile {
	prefix: string;
	suffix: string;
}

export interface DeepString {
	[key: string]: DeepString | string;
}
