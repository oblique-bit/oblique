/**
 * Model for the `NavTreeComponent` items.
 *
 * @see NavTreeComponent
 */
export class ObNavTreeItemModel {
	id: string;
	label: string;

	labelParams?: Record<string, string | number>;

	items?: ObNavTreeItemModel[];

	path?: string; // See `routerLink` docs under https://angular.io/api/router/RouterLink
	fragment?: string; // See `fragment` docs under https://angular.io/api/router/RouterLink
	queryParams?: any; // See `queryParams` docs under https://angular.io/api/router/RouterLink

	disabled? = false;
	collapsed? = false;

	parent?: ObNavTreeItemModel; // Reference to parent, if any.

	// All nested routes, since root nav item:
	routes: any[] = [];

	constructor(json: any, parent?: ObNavTreeItemModel) {
		Object.assign(this, json);
		if (parent) {
			this.parent = parent;
			this.routes = [...this.parent.routes]; // ES6 array copy :)
		}

		// Ensure item has a path and a full route:
		this.path = this.path || this.id;
		this.routes.push(this.path);

		// Convert all sub items:
		if (Array.isArray(json.items)) {
			this.items = json.items.map(item => new ObNavTreeItemModel(item, this));
		}
	}
}
