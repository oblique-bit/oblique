"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestRunner = exports.createAngularApplicationTree = exports.createAngularWorkspaceTree = exports.readSchematicsTemplate = void 0;
const tslib_1 = require("tslib");
const path = require("path");
const fs_1 = require("fs");
const testing_1 = require("@angular-devkit/schematics/testing");
const schematics_1 = require("@angular-devkit/schematics");
const schematics_testing_model_1 = require("./schematics-testing.model");
function readSchematicsTemplate(file, directory = './ng-add/templates') {
    try {
        return fs_1.readFileSync(path.join(__dirname, directory, file), 'utf8');
    }
    catch (error) {
        throw new schematics_1.SchematicsException(`File ${path.join(__dirname, directory, file)} not found.`);
    }
}
exports.readSchematicsTemplate = readSchematicsTemplate;
let runner;
function createAngularWorkspaceTree(workspaceOptions) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const workspaceOption = workspaceOptions ? workspaceOptions : schematics_testing_model_1.workspaceOptionDefaults;
        runner = createTestRunner('../', 'schematics', path.join(schematics_testing_model_1.collectionPathDefault, schematics_testing_model_1.collectionFileDefault));
        return yield runner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOption, schematics_1.Tree.empty()).toPromise();
    });
}
exports.createAngularWorkspaceTree = createAngularWorkspaceTree;
function createAngularApplicationTree(applicationOptions, workspaceTree) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tree = workspaceTree ? workspaceTree : schematics_1.Tree.empty();
        const appOptions = applicationOptions ? applicationOptions : schematics_testing_model_1.appOptionDefaults;
        runner = createTestRunner('../', 'schematics', path.join(schematics_testing_model_1.collectionPathDefault, schematics_testing_model_1.collectionFileDefault));
        return yield runner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree).toPromise();
    });
}
exports.createAngularApplicationTree = createAngularApplicationTree;
function createTestRunner(dir, collectionName, file) {
    collectionName = collectionName ? collectionName : schematics_testing_model_1.collectionNameDefault;
    file = file ? file : schematics_testing_model_1.collectionFileDefault;
    return new testing_1.SchematicTestRunner(collectionName, path.resolve(dir, file));
}
exports.createTestRunner = createTestRunner;
