import {Directive, AfterViewInit, forwardRef, Injector} from '@angular/core';
import {NG_VALIDATORS, FormControl, NgControl} from '@angular/forms';
import {SchemaValidationService} from './schema-validation.service';

export function schemaValidatorFactory(schemaValidationService: SchemaValidationService, propertyName: string) {
    return (c: FormControl) => {
        return schemaValidationService.validate(propertyName, c.value);
    };
}

@Directive({
    selector: '[schemaValidate][ngModel],[schemaValidate][formControl]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => SchemaValidateDirective), multi: true}
    ]
})
export class SchemaValidateDirective implements AfterViewInit {

    private propertyName: string;
    private validator: Function;

    constructor(private schemaValidationService: SchemaValidationService,
                private injector: Injector) {
    }

    ngAfterViewInit(): void {
        //TODO: this is a workaround: if NgControl is required in the constructor, we have cyclic dependencies
        let ngControl: NgControl = this.injector.get(NgControl);

        this.propertyName = this.extractPropertyName(ngControl);

        this.validator = schemaValidatorFactory(this.schemaValidationService, this.propertyName);
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    private extractPropertyName(ngControl: NgControl): string {
        //TODO: this is a workaround to access an internal attribute
        if (ngControl['_parent'].name) {
            return `${this.extractPropertyName(ngControl['_parent'])}.${ngControl.name}`;
        }
        return ngControl.name;
    }
}