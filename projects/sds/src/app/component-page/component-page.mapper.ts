import type {ComponentPage} from './component-page';
import {NewsletterComponent} from './component-pages/newsletter/newsletter.component';
import {AccessibilityStatementComponent} from '../../../../oblique/src/lib/accessibility-statement/accessibility-statement.component';

const components: Record<string, ComponentPage> = {
	newsletter: {
		title: 'Newsletter',
		component: NewsletterComponent,
	},
	'ob-accessibility-statement': {component: AccessibilityStatementComponent},
};

export function getComponentPageComponent(name: string): ComponentPage | undefined {
	return components[name];
}
