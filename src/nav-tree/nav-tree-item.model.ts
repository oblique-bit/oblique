/**
 * Model for the `NavTreeComponent` items.
 *
 * @see NavTreeComponent
 */
export interface NavTreeItemModel {
	label: string;
	items?: NavTreeItemModel[];
	id?: string;
	disabled?: boolean;
	collapsed?: boolean;
}

export class NavTreeItemModel implements NavTreeItemModel {

	disabled? = false;
	collapsed? = false;

	constructor(json: any) {

		Object.assign(this, json);

		if (Array.isArray(json.items)) {
			this.items = json.items.map((item) => {
				return new NavTreeItemModel(item);
			});
		}
	}
}
