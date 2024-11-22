import {ComponentPageComponent} from './component-page.component';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export default [
	{path: '', component: ComponentPageComponent},
	{path: '**', redirectTo: 'introductions/welcome'}
];
