import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SchemaValidationDirective} from './schema-validation.directive';
import {SchemaValidateDirective} from './schema-validator';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [SchemaValidateDirective, SchemaValidationDirective],
    exports: [SchemaValidateDirective, SchemaValidationDirective]
})
export class SchemaValidationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SchemaValidationModule
        };
    }
}
