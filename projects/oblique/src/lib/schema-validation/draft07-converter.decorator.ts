export function draft07Convert(target, propertyKey: string, descriptor: PropertyDescriptor): any {
	const oldValue = descriptor.value;

	descriptor.value = function (): void {
		const schema = JSON.parse(JSON.stringify(arguments[0])); // deep clone
		convert(schema);
		return oldValue.call(this, schema);
	};

	return descriptor;

	function convert(schema): void {
		convertId(schema);
		schema.required = schema.required || [];

		if (schema.properties) {
			Object.keys(schema.properties).forEach((propertyName: string) => {
				const property = schema.properties[propertyName];
				arrayifyRequired(property, propertyName, schema);
				convertAnyIntoObject(property);
				if (property.items || property.properties) {
					convert(property.items || property);
				}
			});
		}
	}

	function convertId(schema): void {
		if (schema.id) {
			schema.$id = schema.id;
			delete schema.id;
		}
	}

	function arrayifyRequired(property, propertyName, schema): void {
		if (property.required && !property.required.length) {
			schema.required.push(propertyName);
			delete property.required;
		}
	}

	function convertAnyIntoObject(property): void {
		if (property.type === 'any') {
			property.type = 'object';
		}
	}
}
