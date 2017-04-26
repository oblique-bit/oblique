/**
 * Model for the `NavTreeComponent` items.
 *
 * @see NavTreeComponent
 */
export interface INavTreeItemModel {
	label: string;
	items?: INavTreeItemModel[];
	id?: string;
	disabled?: boolean;
	collapsed?: boolean;
}

export class NavTreeItemModel implements INavTreeItemModel {
	label: string;
	items?: NavTreeItemModel[];
	id?: string;
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
