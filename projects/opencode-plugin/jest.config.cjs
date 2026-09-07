// @ts-check

module.exports = {
	displayName: {
		name: "OpenCode Plugin",
		color: "cyan",
	},
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"^.+\\.(ts|js|mjs)$": ["ts-jest", { tsconfig: "tsconfig.spec.json", allowJs: true }],
	},
	transformIgnorePatterns: ["/node_modules/(?!(?:@opencode-ai)/)"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
		"^@opencode-ai/plugin/v2/promise$": "<rootDir>/../../node_modules/@opencode-ai/plugin/dist/v2/promise/index.js",
	},
	testMatch: ["**/tests/**/*.spec.ts"],
	collectCoverageFrom: ["src/**/*.ts"],
	coverageDirectory: "../../coverage/opencode-plugin",
	testPathIgnorePatterns: ["<rootDir>/dist/"],
	modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
