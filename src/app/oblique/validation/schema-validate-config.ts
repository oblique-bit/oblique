export class SchemaValidateConfig {
    messageParsers: ((name:string, value, error, schema) => string)[] = new Array<(name:string, value, error, schema) => string>();
}
