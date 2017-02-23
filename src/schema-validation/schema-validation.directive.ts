import {Directive, Input, AfterViewInit} from '@angular/core';
import {SchemaValidationService} from './schema-validation.service';

@Directive({
    selector: '[schemaValidation]',
    providers: [SchemaValidationService]
})
export class SchemaValidationDirective implements AfterViewInit {
    @Input('schemaValidation') schema: any;

    constructor(private schemaValidationService: SchemaValidationService) {

    }

    ngAfterViewInit(): void {
        this.schemaValidationService.compileSchema(this.schema);
    }

}
