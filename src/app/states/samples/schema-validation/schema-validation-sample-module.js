(function () {
	'use strict';

	angular
		.module('__MODULE__.samples')
		.config(function ($stateProvider) {
			$stateProvider.state('samples.schemaValidation', {
				url: '/schema-validation',
				templateUrl: 'samples/schema-validation/schema-validation-sample.tpl.html',
				controller: 'SchemaValidationSampleController',
				data: {
					description: 'states.samples.schema-validation.description'
				},
				resolve: {
					data : function() {
						return {
							"id": 0,
							"text": null,
							"number": "42",
							"integer": 1,
							"date": null,
							"time": "2015-05-21T09:00:00+02:00",
							"select": "ccc",
							"multiselect": ["aaa", "ccc"],
							"object": {
								"subproperty": 33
							}
						};
					},
					schema: function() {
						return {
							"$schema": "http://json-schema.org/draft-04/schema#",
							"title": "SampleValidationSchema",
							"type": "object",
							"required": [
								"id",
								"text",
								"number",
								"date",
								"time"
							],
							"properties": {
								"id": {
									"type": "integer"
								},
								"text": {
									"type": "string",
									"minLength": 1,
									"maxLength": 64
								},
								"numberString": {
									"type": "number",
									"minimum": 1,
									"maximum": 10000000,
									"exclusiveMinimum": true
								},
								"integer": {
									"type": "integer",
									"minimum": 0,
									"maximum": 100,
									"exclusiveMaximum": true
								},
								"date": {
									"type": [
										"object",
										"string"
									],
									"format": "date-time"
								},
								"time": {
									"format": "date-time",
									"type": [
										"object",
										"string"
									]
								},
								"select": {
									"type": "string",
									"options": [
										{ "label" : "Aaa", "value": "aaa"},
										{ "label" : "Bbb", "value": "bbb"},
										{ "label" : "Ccc", "value": "ccc"},
										{ "label" : "Ddd", "value": "ddd"},
										{ "label" : "Eee", "value": "eee"}
									]
								},
								"multiselect": {
									"type": "array",
									"items": {
										"type": "string"
									},
									"minItems": 1,
									"maxItems": 4,
									"options": [
										{ "label" : "Aaa", "value": "aaa"},
										{ "label" : "Bbb", "value": "bbb"},
										{ "label" : "Ccc", "value": "ccc"},
										{ "label" : "Ddd", "value": "ddd"},
										{ "label" : "Eee", "value": "eee"}
									]
								},
								"textarea": {
									"type": "string",
									"minLength": 5,
									"maxLength": 140
								},
								"object": {
									"type": "object",
									"properties": {
										"subproperty": {
											"type": "integer",
											"minimum": 20,
											"maximum": 42
										}
									}
								}
							}
						};
					}
				}
			});
		});
}());
