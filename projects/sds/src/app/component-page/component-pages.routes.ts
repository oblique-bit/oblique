import {ComponentPageComponent} from './component-page.component';

export default [
	{path: '', component: ComponentPageComponent},
	{path: '**', redirectTo: 'introductions/welcome'}
];
