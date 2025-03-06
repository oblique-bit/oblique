import {ComponentPageComponent} from './component-page.component';

export default [
	{path: 'newsletter', component: ComponentPageComponent},
	{path: '**', redirectTo: 'introductions/welcome'}
];
