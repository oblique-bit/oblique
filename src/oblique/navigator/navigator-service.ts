/**
 * State navigator.
 *
 * Inspired by: http://plnkr.co/edit/DJH6mQUCbTFfSbdCBYUo?p=preview
 *
 * USAGE: define a `navigator` config for required states providing a transition state name or callback function
 *
 * $stateProvider.state('users.user', { // 'users' could be an abstrat, unreacheable state
	 *     [...],
	 *     navigator: {
	 *         up: 'users.search'
	 *         // -- OR --
	 *         up: function(navigator, $state, $rootScope) {
	 *             $rootScope.comingFromHome ? $state.go('home') : $state.go('users.search');
	 *         }
	 *     }
	 * });
 */
export class NavigatorService {
	history = [];

	/*@ngInject*/
	constructor(private $state:ng.ui.IStateService,
	            private $rootScope:ng.IRootScopeService) {

	}

	push(state, params) {
		this.history.push({state: state, params: params});
	}

	up() {
		let config:any = (this.$state.current.data && this.$state.current.data.navigator) || {};
		if(angular.isFunction(config.up)) {
			return config.up(this, this.$state, this.$rootScope);
		} else {
			let parent = config ? this.$state.get(config.up) : null;
			if (parent) {
				return this.$state.go(parent);
			} else {
				parent = this.$state.get('^');
				if (parent && !parent.abstract) {
					return this.$state.go('^');
				} else {
					// TODO: try to find a navigable grandparent state.
					return this.$rootScope.$broadcast('$navigatorStateError',
						{
							direction: 'up',
							message: 'Unable to retrieve a valid state to navigate UP. Either ensure that parent state is not abstract or ensure that current state configuration specifies a "data.navigator.up" property pointing to a valid state.',
							config: config,
							current: this.$state.current,
							parent: parent
						}
					);
				}
			}
		}
	}

	back() {
		let previous = this.history.pop();
		if(previous) {
			return this.go(previous);
		} else {
			this.$rootScope.$broadcast('$navigatorStateError',
				{
					direction: 'back',
					message: 'No state history in order to navigate BACK. If you want to override default behaviour, you can specify a "data.navigator.back" property pointing to a valid state in current state configuration.',
					config: null,
					current: this.$state.current,
					parent: parent
				}
			);
		}
	}

	go(state) {
		return this.$state.go(state.state, state.params);
	}

	init() {
		this.$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
			if (!fromState.abstract && fromState.name !== toState.name) {
				this.push(fromState, fromParams);
			}
		});
	}
}
