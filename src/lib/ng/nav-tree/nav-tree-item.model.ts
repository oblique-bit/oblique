/**
 * Model for the `NavTreeComponent` items.
 *
 * @see NavTreeComponent
 */
export class NavTreeItemModel {
	id: string;
	label: string;

	items?: NavTreeItemModel[];

	path?: string; // See `routerLink` docs under https://angular.io/api/router/RouterLink
	fragment?: string; // See `fragment` docs under https://angular.io/api/router/RouterLink
	queryParams?: any; // See `queryParams` docs under https://angular.io/api/router/RouterLink

	disabled = false;
	collapsed = false;

	parent?: NavTreeItemModel; // Reference to parent, if any.

	// All nested routes, since root nav item:
	routes: any[] = [];

	constructor(json: any, parent?: NavTreeItemModel) {

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
			this.items = json.items.map((item) => {
				return new NavTreeItemModel(item, this);
			});
		}
	}
}
