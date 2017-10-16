export function draft06(target, propertyKey: string, descriptor: PropertyDescriptor): any {
	const oldValue = descriptor.value;

	descriptor.value = function() {
		let schema = arguments[0];
		if (schema.id) {
			schema.$id = schema.id;
			delete schema.id;
		}

		if (!schema.required) {
			schema.required = [];
			Object.keys(schema.properties).forEach((property) => {
				if (schema.properties[property].required) {
					schema.required.push(property);
					delete schema.properties[property].required;
				}
			});
		}
		oldValue.apply(this, arguments);
	};

	return descriptor;
}



