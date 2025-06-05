import {ComponentPage} from './component-page';
import {NewsletterComponent} from './component-pages/newsletter/newsletter.component';

const components: Record<string, ComponentPage> = {
	newsletter: {
		title: 'Newsletter',
		component: NewsletterComponent
	}
};

export function getComponentPageComponent(name: string): ComponentPage | undefined {
	return components[name];
}
