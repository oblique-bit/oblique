export class NavigatorService {
	private states = [];

	/*@ngInject*/
	constructor(private $state:ng.ui.IStateService,
	            private $rootScope:ng.IRootScopeService) {

	}

	push(state, params) {
		this.states.push({state: state, params: params});
	}

	all() {
		return this.states;
	}

	up() {
		//TODO: There is no navigator on $state.current
		let config:any = /*this.$state.current.navigator ||*/ {};
		let parent = config ? this.$state.get(config.up) : null;
		if (parent) {
			this.$state.go(parent, this.$state.params);
		} else {
			parent = this.$state.get('^');
			if (parent && !parent.abstract) {
				this.$state.go('^');
			} else {
				// TODO: try to find a navigable grandparent state.
				this.$rootScope.$broadcast('$navigatorStateError',
					{
						direction: 'up',
						message: 'Unable to retrieve a valid state to navigate UP. Either ensure that parent state is not abstract or ensure that current state configuration specifies a "navigator.up" property pointing to a valid state.',
						config: config,
						current: this.$state.current,
						parent: parent
					}
				);
			}
		}
		return false;
	}

	previous(step) {
		let prev = this.states[this.states.length - Math.abs(step || 1)];
		return this.go(prev);
	}

	back() {
		return this.previous(-1);
	}

	go(state) {
		return this.$state.go(state.state, state.params);
	}
}
