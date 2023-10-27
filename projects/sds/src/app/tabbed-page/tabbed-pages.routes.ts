import {TabbedPageComponent} from './tabbed-page.component';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export default [{path: '', component: TabbedPageComponent, children: [{path: '**', component: TabbedPageComponent}]}];
