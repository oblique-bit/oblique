/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

// @ts-check
const coverageConfig = require("../../tests/jest.config.coverage");

module.exports = {
	displayName: {
		name: "MCP",
		color: "magenta",
	},
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"^.+\\.(ts|mjs)$": ["ts-jest", { tsconfig: "tsconfig.spec.json", allowJs: true }],
	},
	transformIgnorePatterns: ["node_modules/(?!@angular/compiler/)"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	...coverageConfig,
	coverageDirectory: "../../coverage/mcp",
	collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"],
};
