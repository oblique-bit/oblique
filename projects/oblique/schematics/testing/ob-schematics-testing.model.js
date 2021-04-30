"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseAngularProjectExpectedFiles = exports.obTemplateList = exports.collectionPathDefault = exports.collectionFileDefault = exports.collectionNameDefault = exports.schematicsFolder = exports.ObSchematicTestRunner = exports.obNgAddOptionsDefault = exports.ObILoggingTestArrayLists = exports.baseAppOptionDefaults = exports.baseWorkspaceOptionDefaults = exports.ObESchematicsOperationType = void 0;
const schema_1 = require("@schematics/angular/workspace/schema");
const schema_2 = require("@angular/cli/lib/config/schema");
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
var ObESchematicsOperationType;
(function (ObESchematicsOperationType) {
    ObESchematicsOperationType["CREATE"] = "CREATE";
    ObESchematicsOperationType["READ"] = "READ";
    ObESchematicsOperationType["OVERWRITE"] = "OVERWRITE";
    ObESchematicsOperationType["DELETE"] = "DELETE";
})(ObESchematicsOperationType = exports.ObESchematicsOperationType || (exports.ObESchematicsOperationType = {}));
exports.baseWorkspaceOptionDefaults = {
    name: 'new-application',
    version: '11.2.0',
    packageManager: schema_1.PackageManager.Npm,
    strict: true
};
exports.baseAppOptionDefaults = {
    name: 'new-application',
    projectRoot: '',
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    style: schema_2.Style.Scss,
    skipTests: false,
    skipPackageJson: false
};
class ObILoggingTestArrayLists {
    constructor() {
        this.debug = [];
        this.info = [];
        this.warn = [];
        this.error = [];
        this.fatal = [];
    }
}
exports.ObILoggingTestArrayLists = ObILoggingTestArrayLists;
exports.obNgAddOptionsDefault = {
    title: 'Title',
    theme: 'material',
    font: 'frutiger',
    locales: 'de-CH fr-CH it-CH',
    ajv: true,
    unknownRoute: true,
    httpInterceptors: true,
    banner: false,
    externalLink: true,
    prefix: "app",
    jest: true,
    protractor: false,
    npmrc: true,
    proxy: "",
    sonar: true,
    jenkins: "ORG;APP",
    static: true,
    eslint: true,
    husky: true,
    ie11: false
};
class ObSchematicTestRunner extends testing_1.SchematicTestRunner {
    constructor(_collectionName, collectionPath) {
        super(_collectionName, collectionPath);
    }
}
exports.ObSchematicTestRunner = ObSchematicTestRunner;
exports.schematicsFolder = '../schematics';
exports.collectionNameDefault = 'schematics';
exports.collectionFileDefault = 'collection.json';
exports.collectionPathDefault = path.join(__dirname, '../');
exports.obTemplateList = [
    'default-eslintrc.json.config',
    'default-Jenkinsfile.config',
    'default-jestGlobalMocks.config',
    'default-master-layout.html',
    'default-prettierrc.config',
    'default-sonar-project.properties.config',
    'default-tsconfig.spec.json',
    'home.component.scss.config',
    'home-material.component.html',
    'default-index.html',
    'default-jest.config',
    'default-manifest-dev.yml.config',
    'default-npmrc.config',
    'default-proxy.conf.json.config',
    'default-Staticfile.config',
    'home-bootstrap.component.html',
    'home.component.ts.config'
];
exports.baseAngularProjectExpectedFiles = [
    '/README.md',
    '/.editorconfig',
    '/.gitignore',
    '/angular.json',
    '/package.json',
    '/tsconfig.json',
    '/tslint.json',
    '/.browserslistrc',
    '/karma.conf.js',
    '/tsconfig.app.json',
    '/tsconfig.spec.json',
    '/src/favicon.ico',
    '/src/index.html',
    '/src/main.ts',
    '/src/polyfills.ts',
    '/src/styles.scss',
    '/src/test.ts',
    '/src/assets/.gitkeep',
    '/src/environments/environment.prod.ts',
    '/src/environments/environment.ts',
    '/src/app/app-routing.module.ts',
    '/src/app/app.module.ts',
    '/src/app/app.component.scss',
    '/src/app/app.component.html',
    '/src/app/app.component.spec.ts',
    '/src/app/app.component.ts',
    '/e2e/protractor.conf.js',
    '/e2e/tsconfig.json',
    '/e2e/src/app.e2e-spec.ts',
    '/e2e/src/app.po.ts'
];
