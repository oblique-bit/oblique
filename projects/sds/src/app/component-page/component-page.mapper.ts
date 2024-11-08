import {ComponentPage} from './component-page';

export class ComponentPageMapper {
	private static readonly components: Record<string, ComponentPage> = {};

	static getComponentPageComponent(name: string): ComponentPage | undefined {
		return this.components[name];
	}
}
