import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-plugin/recommended",
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/process-inline-templates",
    "plugin:prettier/recommended",
).map(config => ({
    ...config,
    files: ["**/*.ts"],
})), {
    files: ["**/*.ts"],

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["tsconfig.json"],
            createDefaultProgram: true,
        },
    },

    rules: {
        "@typescript-eslint/member-ordering": ["error", {
            default: [
                "public-static-field",
                "public-instance-field",
                "protected-static-field",
                "protected-instance-field",
                "private-static-field",
                "private-instance-field",
                "public-constructor",
                "protected-constructor",
                "private-constructor",
                "public-static-method",
                "public-instance-method",
                "protected-static-method",
                "protected-instance-method",
                "private-static-method",
                "private-instance-method",
            ],
        }],
        "@angular-eslint/no-pipe-impure": "error",
        "@angular-eslint/prefer-output-readonly": "error",
        "@angular-eslint/prefer-signals": "off",
        "@angular-eslint/prefer-standalone": "off",
        "@angular-eslint/relative-url-prefix": "error",
        "@angular-eslint/use-component-selector": "error",
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/ban-tslint-comment": "error",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/default-param-last": "error",
        "@typescript-eslint/method-signature-style": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/prefer-readonly": "error",
        "@typescript-eslint/prefer-regexp-exec": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",
        "@typescript-eslint/unified-signatures": "error",
        "dot-notation": "error",
        eqeqeq: ["error", "smart"],
        "guard-for-in": "error",

        "max-lines": ["error", {
            max: 300,
        }],

        "max-lines-per-function": ["error", {
            max: 35,
        }],

        "no-bitwise": "error",
        "no-caller": "error",

        "no-console": ["error", {
            allow: ["info", "warn", "error"],
        }],

        "no-else-return": "error",
        "no-eval": "error",
        "no-new-wrappers": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-unused-expressions": "error",
        "no-useless-concat": "error",
        "no-useless-escape": "error",
        "object-shorthand": "error",
        "prefer-exponentiation-operator": "error",
        "prefer-object-spread": "error",
        "prefer-regex-literals": "error",
        "prefer-template": "error",
        radix: "error",

        "sort-imports": ["error", {
            ignoreDeclarationSort: true,
        }],

        "spaced-comment": "error",
    },
}, {
    files: ["**/*.spec.ts"],

    rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@angular-eslint/use-component-selector": "off",
        "max-lines-per-function": "off",
        "max-lines": "off",
    },
}, {
    files: ["**/*.decorator.ts"],

    rules: {
        "max-lines-per-function": "off",
    },
}, ...compat.extends("plugin:@angular-eslint/template/recommended").map(config => ({
    ...config,
    files: ["**/*.html"],
})), ...compat.extends("plugin:prettier/recommended").map(config => ({
    ...config,
    files: ["**/*.html"],
    ignores: ["**/*inline-template-*.component.html"],
})), {
    files: ["**/*.html"],
    ignores: ["**/*inline-template-*.component.html"],

    rules: {
        "prettier/prettier": ["error", {
            parser: "angular",
        }],
    },
}];
