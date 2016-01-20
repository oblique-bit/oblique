/* global angular */
(function () {
	"use strict";

	/**
	 * State navigator.
	 *
	 * Inspired by: http://plnkr.co/edit/DJH6mQUCbTFfSbdCBYUo?p=preview
	 */
	angular.module('__MODULE__.oblique')
	.service("$navigator", function($state, $log, $rootScope) {

		var states = [];
		var service = {
			push: function(state, params) {
				states.push({ state: state, params: params });
			},
			all: function() {
				return states;
			},
			up: function() {
				var config = $state.current.navigator || {};
				var parent = config ? $state.get(config.up) : null;
				if(parent) {
					return $state.go(parent, $state.params);
				} else {
					parent = $state.get('^');
					if(parent && !parent.abstract) {
						return $state.go('^');
					} else {
						// TODO: try to find a navigable grandparent state.
						$rootScope.$broadcast('$navigatorStateError',
							{
								direction: 'up',
								message: 'Unable to retrieve a valid state to navigate UP. Either ensure that parent state is not abstract or ensure that current state configuration specifies a `navigator.up` property pointing to a valid state.',
								config: config,
								current: $state.$current.self,
								parent: parent
							}
						);
					}
				}
				return false;
			},
			previous: function(step) {
				var prev = states[states.length - Math.abs(step || 1)];
				return this.go(prev);
			},
			back: function() {
				return this.previous(-1);
			},
			go: function(state) {
				return $state.go(state.state, state.params);
			}
		};
		return service;
	});
}());
