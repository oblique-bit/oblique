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
							"text": null, //"Hello, World!",
							"number": 1,
							"numberString": "42",
							"date": null, //"2015-05-27T11:21:05+02:00",
							"time": "2015-05-21T09:00:00+02:00",
							"select": "ccc",
							"multiselect": ["aaa", "ccc"]
						};
					},
					schema: function() {
						return {
							"$id": "1",
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
									"$id": "2",
									"type": "integer"
								},
								"text": {
									"type": "string",
									"minLength": 1,
									"maxLength": 64
								},
								"numberString": {
									"$id": "3",
									"type": "number",
									"minimum": 1,
									"maximum": 10000000,
									"exclusiveMinimum": true
								},
								"number": {
									"$id": "3",
									"type": "number",
									"minimum": 0,
									"maximum": 100,
									"exclusiveMaximum": true
								},
								"date": {
									"$id": "4",
									"type": [
										"object",
										"string"
									],
									"format": "date-time"
								},
								"time": {
									"$id": "5",
									"format": "date-time",
									"type": [
										"object",
										"string"
									]
								},
								"select": {
									"$id": "8",
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
									"$id": "8",
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
								}
							}
						};
					}
				}
			});
		});
}());
