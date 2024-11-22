import {ComponentPage} from './component-page';
import {NewsletterComponent} from './component-pages/newsletter/newsletter.component';

export class ComponentPageMapper {
	private static readonly components: Record<string, ComponentPage> = {
		newsletter: {
			title: 'Newsletter',
			component: NewsletterComponent
		}
	};

	static getComponentPageComponent(name: string): ComponentPage | undefined {
		return this.components[name];
	}
}
